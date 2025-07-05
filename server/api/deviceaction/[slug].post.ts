interface DeviceStatus {
    ji: string;
    led: string;
    lastUpdated: Date;
}

// In-memory cache
const statusCache = new Map<string, DeviceStatus>();

export async function getDeviceStatus(deviceId: string): Promise<DeviceStatus | null> {
    try {
        return statusCache.get(deviceId) || null;
    } catch (error) {
        console.error('Database error, falling back to cache:', error);
        return statusCache.get(deviceId) || null;
    }
}

export async function updateDeviceStatus(
    deviceId: string, 
    type: 'ji' | 'led', 
    status: string
): Promise<void> {
    const now = new Date();
    const currentStatus = await getDeviceStatus(deviceId) || {
        ji: '',
        led: '',
        lastUpdated: now
    };

    const updatedStatus = {
        ...currentStatus,
        [type]: status,
        lastUpdated: now
    };

    try {
        statusCache.set(deviceId, updatedStatus);
    } catch (error) {
        console.error('Database error, updating cache only:', error);
        statusCache.set(deviceId, updatedStatus);
    }
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const slug = getRouterParams(event).slug;
    const deviceId = body.deviceId;
    
    if (!deviceId) {
        throw createError({
            statusCode: 400,
            message: 'deviceId is required'
        });
    }

    if (slug === 'jistatus') {
        updateDeviceStatus(deviceId, 'ji', body.status);
        return {
            success: true,
            message: `JI status updated to: ${body.status}`
        };
    }
    
    if (slug === 'ledstatus') {
        updateDeviceStatus(deviceId, 'led', body.status);
        return {
            success: true,
            message: `LED status updated to: ${body.status}`
        };
    }

    if (slug === 'status') {
        const status = getDeviceStatus(deviceId);
        if (!status) {
            throw createError({
                statusCode: 404,
                message: `No status found for device: ${deviceId}`
            });
        }
        return status;
    }

    throw createError({
        statusCode: 400,
        message: `Invalid action: ${slug}`
    });
});
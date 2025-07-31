import sql from "~/server/db/pg";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const slug = getRouterParam(event, "slug");
  const deviceId = body.deviceId;

  if (!deviceId) {
    throw createError({
      statusCode: 400,
      message: "deviceId is required",
    });
  }

  if (slug === "jistatus") {
    const { status } = body;
    if (typeof status !== "boolean") {
      throw createError({
        statusCode: 400,
        message: "Status must be a boolean value",
      });
    }
    
    try {
      await sql`
        UPDATE device_status
        SET jistatus = ${status}
        WHERE device_uuid = ${deviceId}
      `;
      
      // Also update the quick access cache
      const { setJiStatus } = await import("~/server/saveQuickAccess/jistatus");
      setJiStatus(status);
      
      return {
        success: true,
        message: `JI status updated to: ${status}`,
        jistatus: status,
      };
    } catch (error) {
      console.error("Database error updating JI status:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to update JI status",
      });
    }
  }

  if (slug === "ledstatus") {
    const { ledStatus } = body;
    if (typeof ledStatus !== "number" || ledStatus < 0 || ledStatus > 8) {
      throw createError({
        statusCode: 400,
        message: "LED status must be a number between 0 and 8",
      });
    }
    
    try {
      await sql`
        UPDATE device_status
        SET lightstatus = ${ledStatus}
        WHERE device_uuid = ${deviceId}
      `;
      
      // Also update the quick access cache
      const { setLedStatus } = await import("~/server/saveQuickAccess/ledstatus");
      setLedStatus(ledStatus > 0);
      
      return {
        success: true,
        message: `LED status updated to: ${ledStatus}`,
        lightstatus: ledStatus,
      };
    } catch (error) {
      console.error("Database error updating LED status:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to update LED status",
      });
    }
  }

  if (slug === "status") {
    try {
      const status = await sql`
        SELECT * FROM device_status
        WHERE device_uuid = ${deviceId}
        LIMIT 1
      `;
      
      if (status.length === 0) {
        throw createError({
          statusCode: 404,
          message: `No status found for device: ${deviceId}`,
        });
      }
      
      return {
        success: true,
        data: status[0],
      };
    } catch (error) {
      console.error("Database error fetching status:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to fetch device status",
      });
    }
  }

  throw createError({
    statusCode: 400,
    message: `Invalid action: ${slug}`,
  });
});

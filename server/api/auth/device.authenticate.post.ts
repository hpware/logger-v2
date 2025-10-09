import { authenticateDevice } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { deviceKey } = body;

    if (!deviceKey) {
      throw createError({
        statusCode: 400,
        statusMessage: "Device key is required",
      });
    }

    const user = await authenticateDevice(deviceKey);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid device key",
      });
    }

    return {
      user,
      isDeviceAuth: true,
    };
  } catch (error: any) {
    console.error("Device authentication error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Device authentication failed",
    });
  }
});

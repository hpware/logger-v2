import sql from "~/server/db/pg";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { deviceId, password } = body;

  if (!deviceId || !password) {
    throw createError({
      statusCode: 400,
      message: "Device ID and password are required",
    });
  }

  try {
    // Check if device exists and password matches
    const device = await sql`
      SELECT * FROM machines 
      WHERE uuid = ${deviceId} 
      LIMIT 1
    `;

    if (device.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Device not found",
      });
    }

    if (device[0].token !== password) {
      throw createError({
        statusCode: 401,
        message: "Invalid password",
      });
    }

    // Generate a simple token (in production, you might want to use JWT)
    const token = Buffer.from(`${deviceId}:${Date.now()}`).toString("base64");

    return {
      success: true,
      token: token,
      deviceId: deviceId,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    throw createError({
      statusCode: 500,
      message: "Authentication failed",
    });
  }
});

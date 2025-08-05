import sql from "~/server/db/pg";
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log(body);

    if (
      !body ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
        body.deviceId,
      ) ||
      typeof body.light === "undefined" ||
      typeof body.local_jistatus !== "boolean"
    ) {
      return {
        success: false,
        message: "Request body is required",
      };
    }

    const deviceId = body.deviceId;
    // Convert to correct types if needed
    const light =
      typeof body.light === "string" ? parseInt(body.light, 10) : body.light;
    await sql`
      UPDATE device_status
      SET lightstatus = ${light}, jistatus = ${body.local_jistatus}
      WHERE device_uuid = ${deviceId}
    `;

    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      message: e.message,
    };
  }
});

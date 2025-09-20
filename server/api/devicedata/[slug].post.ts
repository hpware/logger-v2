import sql from "~/server/db/pg";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const slug = getRouterParam(event, "slug");

  // Validate slug
  if (!slug) {
    return {
      cached: true,
      error: "Device slug is required",
    };
  }

  const { dataid } = body;
  try {
    // Get latest data
    const latestData = await sql`
      SELECT * FROM logger
      WHERE device_uuid = ${slug}
      ORDER BY id DESC 
      LIMIT 1
    `;

    const data = latestData[0];

    if (!data || dataid >= data.id) {
      return {
        cached: true,
        dataid: dataid,
      };
    }
    const deviceExists = await sql`
      SELECT * FROM machines
      WHERE uuid = ${slug}
      LIMIT 1
    `;
    if (deviceExists.length === 0) {
      return {
        cached: true,
        dataid: dataid,
        error: "Device not found",
      };
    }

    // Get detected items
    const detectedItems = await sql`
      SELECT * FROM detect
      WHERE device_id = ${slug}
      ORDER BY detected_at DESC
    `;

    return {
      cached: false,
      dataid: data.id,
      newsItems: detectedItems.length > 0,
      // Weather data
      cwa_location: data.cwa_location,
      cwa_type: data.cwa_type,
      cwa_temp: data.cwa_temp,
      cwa_hum: data.cwa_hum,
      cwa_daily_high: data.cwa_daily_high,
      cwa_daily_low: data.cwa_daily_low,
      // Local sensor data
      local_temp: data.local_temp,
      local_hum: data.local_hum,
      local_jistatus: data.local_jistatus,
      local_light: data.local_light,
      local_gps_lat: data.local_gps_lat,
      local_gps_long: data.local_gps_long,
      local_time: data.local_time,
      // Detected items as JSON
      local_detect: detectedItems,
      device_live_link: deviceExists[0].ip,
    };
  } catch (error) {
    console.error("Database error:", error);
    return {
      cached: true,
      dataid: dataid,
      error: "Database connection failed",
    };
  }
});

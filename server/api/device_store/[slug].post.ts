import sql from "~/server/db/pg";
import { getJiStatus } from "~/server/saveQuickAccess/jistatus";
import { getLedStatus } from "~/server/saveQuickAccess/ledstatus";

async function fastSave(slug: string, body: any) {
  const {
    cwa_type,
    cwa_location,
    cwa_temp,
    cwa_hum,
    cwa_daliyHigh,
    cwa_daliyLow,
    local_temp,
    local_hum,
    local_gps_lat,
    local_gps_long,
    local_time,
    local_jistatus,
    local_detect,
  } = body;

  const save = await sql`
      INSERT INTO logger (
          created_at,  /* Changed from timestamp to created_at */
          cwa_type,
          cwa_location,
          cwa_temp,
          cwa_hum,
          cwa_daily_high,
          cwa_daily_low,
          local_temp,
          local_hum,
          local_gps_lat,
          local_gps_long,
          local_time,
          local_jistatus,
          local_light,
          local_detect,
          device_uuid
          ) VALUES (
          CURRENT_TIMESTAMP,
          ${cwa_type},
          ${cwa_location},
          ${cwa_temp},
          ${cwa_hum},
          ${cwa_daliyHigh},
          ${cwa_daliyLow},
          ${local_temp},
          ${local_hum},
          ${local_gps_lat},
          ${local_gps_long},
          ${local_time},
          ${local_jistatus ? true : false},
          ${getLedStatus() ? true : false},
          ${JSON.stringify(local_detect)},
          ${slug}
      )`;
  console.log(save);
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    return {
      success: false,
      message: "Device slug is required",
    };
  }
  const body = await readBody(event);
  fastSave(slug, body);
  return {
    success: true,
    jistatus: getJiStatus(),
    ledstatus: getLedStatus(),
  };
});

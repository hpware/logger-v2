import sql from "~/server/db/pg";

async function fastSave() {}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
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
  fastSave();
  return {
    success: true,
    jistatus: save,
    ledstatus: gfa(),
  }
});

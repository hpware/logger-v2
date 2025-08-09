import sql from "~/server/db/pg";
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  const getData = await sql`
    SELECT * from device_status
    WHERE device_uuid = ${slug}
    LIMIT 1;
    `;
  return getData[0] || {};
});

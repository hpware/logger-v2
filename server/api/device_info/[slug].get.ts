import sql from "~/server/db/pg";
export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, "slug");
    const getData = await sql`
    SELECT name, uuid, ip, created_at from machines
    WHERE uuid = ${slug}
    LIMIT 1;
    `
    return getData[0] || {};
})
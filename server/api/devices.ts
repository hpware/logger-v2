import sql from "~/server/db/pg";
export default defineEventHandler(async (event) => {
    const getClients = await sql`
        SELECT * FROM machines`
  return {
    endpoint: "/logger/devicedata/",
    viewpoint: "/logger/device/",
    data: getClients
  };
});

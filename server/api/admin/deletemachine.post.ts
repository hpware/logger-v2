import sql from "~/server/db/pg";

export default defineEventHandler(async (event) => {
 
   
  const body = await readBody(event);
  const { machine_uuid, password } = body;

  const matchPasswordget = await sql`
        SELECT * FROM machines WHERE uuid = ${machine_uuid}`;
  if (matchPasswordget.length === 0) {
    return {
      success: false,
      message: "MACHINE_NOT_FOUND",
    };
  }
  if (matchPasswordget[0].token !== password) {
    return {
      success: false,
      message: "REQUEST_NOT_ALLOWED",
    };
  }

  const deletedResult = await sql`
        DELETE FROM machines WHERE uuid = ${machine_uuid}`;

  console.log(deletedResult);
  return {
    success: true,
    message: "Machine deleted successfully",
  };
});

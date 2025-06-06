import sql from "~/server/db/pg";
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const {
        machine_name,
        password
    } = body;

    const matchPasswordget = await sql`
        SELECT * FROM machines WHERE name = ${machine_name}`
if (matchPasswordget.length === 0) {
        return {
            success: false,
            message: "MACHINE_NOT_FOUND"
        };
    }
    if (matchPasswordget[0].token !== password) {
        return {
            success:false,
            message: "REQUEST_NOT_ALLOWED"
        };
    }

    const deletedResult = await sql`
        DELETE FROM machines WHERE name = ${machine_name}`;
    
    console.log(deletedResult);
    return {
        success: true,
        message: "Machine deleted successfully",
    };
});
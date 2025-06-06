import sql from "~/server/db/pg";
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const {
        machine_name,
        machine_ip,
    } = body;
    
    const save = await sql`
        INSERT INTO machines (
            created_at, 
            name, 
            ip, 
            token
        ) VALUES (
            CURRENT_TIMESTAMP,
            ${machine_name},
            ${machine_ip},
            'sss'
        )`;
    
    console.log(save);
    return {
        success: true,
        message: "Machine created successfully",
    };
});
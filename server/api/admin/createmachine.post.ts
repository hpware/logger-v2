import sql from "~/server/db/pg";
import { v4 as uuidv4 } from "uuid";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { machine_name, machine_ip, password, specified_uuid } = body;
  const uuid = uuidv4();
  const save = await sql`
        INSERT INTO machines (
            created_at, 
            uuid,
            name, 
            ip, 
            token
        ) VALUES (
            CURRENT_TIMESTAMP,
            ${/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(specified_uuid) ? specified_uuid : uuid},
            ${machine_name},
            ${machine_ip},
            ${password}
        )`;
  const saveSomeMore = await sql`
  INSERT INTO device_status (
    device_uuid,
    jistatus,
    lightstatus
  ) VALUES (
    ${uuid},
    false,
    0
  )`;
  console.log(save);
  console.log(saveSomeMore);
  return {
    success: true,
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
      specified_uuid,
    )
      ? specified_uuid
      : uuid,
    message: "Machine created successfully",
  };
});

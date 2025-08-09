import sql from "~/server/db/pg";
import { auth } from "~/utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers
  });
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized - No valid session"
    });
  }
  try {
    const body = await readBody(event);
    const { uuid, name, ip, admin_password } = body || {};

    if (
      !uuid ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
        uuid,
      )
    ) {
      throw createError({
        statusCode: 400,
        message: "Invalid or missing uuid",
      });
    }

    // 1. Authenticate using admin_password against the machine's current token
    const matchPasswordget = await sql`
        SELECT * FROM machines WHERE uuid = ${uuid}`;
    if (matchPasswordget.length === 0) {
      return {
        success: false,
        message: "MACHINE_NOT_FOUND",
      };
    }
    if (matchPasswordget[0].token !== admin_password) {
      return {
        success: false,
        message: "REQUEST_NOT_ALLOWED",
      };
    }

    // 2. Build update statement for name/ip only (not token/password)
    const setClauses: string[] = [];
    const values: any[] = [];

    if (typeof name === "string") {
      setClauses.push(`name = $${setClauses.length + 1}`);
      values.push(name);
    }
    if (typeof ip === "string") {
      setClauses.push(`ip = $${setClauses.length + 1}`);
      values.push(ip);
    }

    if (setClauses.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No fields to update",
      });
    }

    // uuid will be the last parameter
    values.push(uuid);

    const query = `
      UPDATE machines
      SET ${setClauses.join(", ")}
      WHERE uuid = $${setClauses.length + 1}
      RETURNING uuid, name, ip, token, created_at
    `;

    const result = await sql.unsafe(query, values);

    if (!result || result.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Machine not found",
      });
    }

    return {
      success: true,
      data: result[0],
    };
  } catch (e: any) {
    if (e?.statusCode) {
      throw e;
    }
    throw createError({
      statusCode: 500,
      message: e?.message || "Failed to update machine",
    });
  }
});

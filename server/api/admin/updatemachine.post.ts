import sql from "~/server/db/pg";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { uuid, name, ip, token } = body || {};

    if (
      !uuid ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(uuid)
    ) {
      throw createError({
        statusCode: 400,
        message: "Invalid or missing uuid",
      });
    }

    // Build update statement using pg-template-tag style to avoid sql.raw
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
    if (typeof token === "string") {
      setClauses.push(`token = $${setClauses.length + 1}`);
      values.push(token);
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

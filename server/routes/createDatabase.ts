import { auth } from "~/utils/auth";

import sql from "~/server/db/pg";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized - No valid session",
    });
  }
  const create1 = await sql`
  CREATE TABLE IF NOT EXISTS logger (
      id SERIAL PRIMARY KEY,
      device_uuid TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      cwa_type VARCHAR(50),
      cwa_location VARCHAR(100),
      cwa_temp DECIMAL(5,2),
      cwa_hum DECIMAL(5,2),
      cwa_daily_high DECIMAL(5,2),
      cwa_daily_low DECIMAL(5,2),
      local_temp DECIMAL(5,2),
      local_hum DECIMAL(5,2),
      local_gps_lat VARCHAR(20),
      local_gps_long VARCHAR(20),
      local_time TIMESTAMPTZ,
      local_jistatus BOOLEAN,
      local_light BOOLEAN,
      local_detect JSONB
  );
  `;

  const create2 = await sql`
      CREATE TABLE IF NOT EXISTS detect (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      item text not null,
      imageURL text not null,
      detected_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      device_id text not null
  )
  `;

  const create3 = await sql`
  create table if not exists jistatus (
      id SERIAL PRIMARY KEY,
      status boolean not null
  )
  `;
  const create4 = await sql`
  create table if not exists machines(
    uuid text primary key,
      name text not null,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      ip text not null,
      token text not null,
      adminonly boolean not null default false
  )`;
  const create5 = await sql`
  create table if not exists device_status(
    device_uuid text primary key not null,
    jistatus boolean not null default false,
    jistatus_timer TIMESTAMP not null,
    lightstatus int not null default 0,
    autocapture boolean not null default true
    )`;
  return {
    created: true,
    message: "Database and tables created successfully",
    tables: {
      logger: create1,
      detect: create2,
      jistatus: create3,
      machines: create4,
      device_status: create5,
    },
  };
});

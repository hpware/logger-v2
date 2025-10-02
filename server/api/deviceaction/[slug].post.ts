import sql from "~/server/db/pg";
import mqtt from 'mqtt';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const deviceId = getRouterParam(event, "slug");

  if (!deviceId) {
    throw createError({
      statusCode: 400,
      message: "deviceId is required",
    });
  }

  const action = body.action;

  if (!action) {
    throw createError({
      statusCode: 400,
      message: "action is required",
    });
  }

  if (action === "jistatus") {
    const { status } = body;
    if (typeof status !== "boolean") {
      throw createError({
        statusCode: 400,
        message: "Status must be a boolean value",
      });
    }

    try {
      await sql`
        UPDATE device_status
        SET jistatus = ${status}
        WHERE device_uuid = ${deviceId}
      `;

      // Also update the quick access cache
      const { setJiStatus } = await import("~/server/saveQuickAccess/jistatus");
      setJiStatus(status);

      // Publish to MQTT
      if (process.env.MQTT_BROKER_URL) {
        const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL);
        mqttClient.on('connect', () => {
          mqttClient.publish(`camera_${deviceId}/jipower`, JSON.stringify(status));
          mqttClient.end();
        });
        mqttClient.on('error', (err) => {
          console.error('MQTT publish error:', err);
        });
      } else {
        console.warn('MQTT_BROKER_URL not set, skipping publish');
      }

      return {
        success: true,
        message: `JI status updated to: ${status}`,
        jistatus: status,
      };
    } catch (error) {
      console.error("Database error updating JI status:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to update JI status",
      });
    }
  }

  if (action === "jistatus_timer") {
    const { timer, static_value } = body;
    if (typeof timer !== "number" || timer < 0) {
      throw createError({
        statusCode: 400,
        message: "Timer must be a non-negative number",
      });
    }
    if (typeof static_value !== "boolean") {
      throw createError({
        statusCode: 400,
        message: "static_value must be a boolean",
      });
    }

    try {
      await sql`
        UPDATE device_status
        SET jistatustimer = ${timer}, jistatus = ${static_value}
        WHERE device_uuid = ${deviceId}
      `;

      // Also update the quick access cache
      const { setJiStatus } = await import("~/server/saveQuickAccess/jistatus");
      setJiStatus(static_value);

      // Publish to MQTT
      if (process.env.MQTT_BROKER_URL) {
        const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL);
        mqttClient.on('connect', () => {
          mqttClient.publish(`camera_${deviceId}/jipower_timer`, JSON.stringify(timer));
          mqttClient.publish(`camera_${deviceId}/jipower`, JSON.stringify(static_value));
          mqttClient.end();
        });
        mqttClient.on('error', (err) => {
          console.error('MQTT publish error:', err);
        });
      } else {
        console.warn('MQTT_BROKER_URL not set, skipping publish');
      }

      return {
        success: true,
        message: `JI timer and status updated`,
        jistatus: static_value,
      };
    } catch (error) {
      console.error("Database error updating JI timer and status:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to update JI timer and status",
      });
    }
  }

  if (action === "ledstatus") {
    const { ledStatus } = body;
    if (typeof ledStatus !== "number" || ledStatus < 0 || ledStatus > 8) {
      throw createError({
        statusCode: 400,
        message: "LED status must be a number between 0 and 8",
      });
    }

    try {
      await sql`
        UPDATE device_status
        SET lightstatus = ${ledStatus}
        WHERE device_uuid = ${deviceId}
      `;

      // Also update the quick access cache
      const { setLedStatus } = await import(
        "~/server/saveQuickAccess/ledstatus"
      );
      setLedStatus(ledStatus > 0);

      // Publish to MQTT
      if (process.env.MQTT_BROKER_URL) {
        const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL);
        mqttClient.on('connect', () => {
          mqttClient.publish(`camera_${deviceId}/led`, JSON.stringify(ledStatus));
          mqttClient.end();
        });
        mqttClient.on('error', (err) => {
          console.error('MQTT publish error:', err);
        });
      } else {
        console.warn('MQTT_BROKER_URL not set, skipping publish');
      }

      return {
        success: true,
        message: `LED status updated to: ${ledStatus}`,
        lightstatus: ledStatus,
      };
    } catch (error) {
      console.error("Database error updating LED status:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to update LED status",
      });
    }
  }

  if (action === "status") {
    try {
      const status = await sql`
        SELECT * FROM device_status
        WHERE device_uuid = ${deviceId}
        LIMIT 1
      `;

      if (status.length === 0) {
        throw createError({
          statusCode: 404,
          message: `No status found for device: ${deviceId}`,
        });
      }

      return {
        success: true,
        data: status[0],
      };
    } catch (error) {
      console.error("Database error fetching status:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to fetch device status",
      });
    }
  }

  throw createError({
    statusCode: 400,
    message: `Invalid action: ${action}`,
  });
});

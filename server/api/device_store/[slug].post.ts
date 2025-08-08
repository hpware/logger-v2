import sql from "~/server/db/pg";
import { getJiStatus } from "~/server/saveQuickAccess/jistatus";
import { getLedStatus } from "~/server/saveQuickAccess/ledstatus";
import { GoogleGenAI } from "@google/genai";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";

async function fastSave(slug: string, body: any) {
  const {
    cwa_type,
    cwa_location,
    cwa_temp,
    cwa_hum,
    cwa_daliyHigh,
    cwa_daliyLow,
    local_temp,
    local_hum,
    local_gps_lat,
    local_gps_long,
    local_time,
    local_jistatus,
    local_detect,
    image,
  } = body;

  console.log(body);

  // Handle undefined local_detect by providing a default value
  const detectData = local_detect || image || null;
  
  const save = await sql`
      INSERT INTO logger (
          created_at,
          cwa_type,
          cwa_location,
          cwa_temp,
          cwa_hum,
          cwa_daily_high,
          cwa_daily_low,
          local_temp,
          local_hum,
          local_gps_lat,
          local_gps_long,
          local_time,
          local_jistatus,
          local_light,
          local_detect,
          device_uuid
          ) VALUES (
          CURRENT_TIMESTAMP,
          ${cwa_type},
          ${cwa_location},
          ${cwa_temp},
          ${cwa_hum},
          ${cwa_daliyHigh},
          ${cwa_daliyLow},
          ${local_temp !== 2147483647 ? local_temp : null},
          ${local_hum !== 2147483647 ? local_hum : null},
          ${local_gps_lat},
          ${local_gps_long},
          ${local_time},
          ${local_jistatus ? true : false},
          ${getLedStatus() ? true : false},
          ${detectData ? JSON.stringify(detectData) : null},
          ${slug}
      )`;
  console.log(save);
}

async function Decode_Image_File_And_Upload_To_S3(
  base64ImageString: string,
  date: string,
  deviceId: string,
) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const base64Data = base64ImageString.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  const fileName = `image_${uuidv4()}.jpg`;

  try {
    const s3Client = new S3Client({
      region: "auto",
      endpoint: process.env.MINIO_ENDPOINT,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY!,
        secretAccessKey: process.env.MINIO_SECRET_KEY!,
      },
      forcePathStyle: true,
    });

    // Upload to MinIO
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.MINIO_BUCKET_NAME!,
        Key: `${deviceId}/${fileName}`,
        Body: buffer,
        ContentType: "image/jpeg",
      },
    });

    await upload.done();
    const imageUrl = `${process.env.R2_URL}/${deviceId}/${fileName}`;

    // Prepare image data for Gemini
    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ];
    // Generate content analysis
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        `What animals do you see in this image? Please be specific but concise, and it REQUIRES to be an animal, no trees, no branches. And return with the JSON format, { "item": "scientific_name", "chinese_name": "chinese_name", "found_timestamp": "the_current_time" }, the current time is aprox: ${new Date().toUTCString()}, and JUST RETURN THE JSON FILE, NO OTHER TEXT, AND NO MARKDOWN. If you cannot find anything, please just return null on the item json.`,
        ...imageParts,
      ],
    });
    const analysis = response.text;
    const jsonRes = JSON.parse(analysis || "{}");
    if (!jsonRes.item) {
      throw new Error("No animal found in the image.");
    }
    console.log({
      fileName,
      imageUrl,
      analysis,
      jsonRes,
      success: true,
    });
    await sql`
    INSERT INTO detect (
      device_id,
      item,
      imageurl,
      detected_at
      )
      VALUES (
      ${deviceId},
      ${jsonRes.item},
      ${imageUrl},
      ${new Date().toISOString()}
    )`;
  } catch (error: any) {
    console.error("Error analyzing image with Gemini:", error);
    console.log({
      fileName,
      imageUrl: null,
      analysis: null,
      success: false,
      jsonRes: null,
      error: error.message,
    });
  }
}

async function uploadImages(body: any, slug: string) {
  const checkIfDeviceIdExists = await sql`
  SELECT * FROM machines WHERE uuid = ${slug} LIMIT 1;
  `;
  if (checkIfDeviceIdExists.length === 0) {
    console.error("Device ID does not exist in the database.");
    return;
  }
  if (Array.isArray(body?.image) && body.image.length > 0) {
    for (const image of body.image) {
      Decode_Image_File_And_Upload_To_S3(image, new Date().toUTCString(), slug);
    }
  }
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    return {
      success: false,
      message: "Device slug is required",
    };
  }
  const body = await readBody(event);
  fastSave(slug, body);
  uploadImages(body, slug);

  const deviceData = await sql`
    SELECT * FROM device_status WHERE device_uuid = ${slug} LIMIT 1;`;
  if (deviceData.length === 0) {
    return {
      success: false,
      message: "Device not found",
    };
  }
  return {
    success: true,
    jistatus: deviceData[0].jistatus,
    newledstatus: deviceData[0].lightstatus,
    autocapture: deviceData[0].autocapture,
  };
});

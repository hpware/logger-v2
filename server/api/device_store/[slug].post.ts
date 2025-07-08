import sql from "~/server/db/pg";
import { getJiStatus } from "~/server/saveQuickAccess/jistatus";
import { getLedStatus } from "~/server/saveQuickAccess/ledstatus";
import { GoogleGenAI } from "@google/genai";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

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
  } = body;

  const save = await sql`
      INSERT INTO logger (
          created_at,  /* Changed from timestamp to created_at */
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
          ${local_temp},
          ${local_hum},
          ${local_gps_lat},
          ${local_gps_long},
          ${local_time},
          ${local_jistatus ? true : false},
          ${getLedStatus() ? true : false},
          ${JSON.stringify(local_detect)},
          ${slug}
      )`;
  console.log(save);
}

async function Decode_Image_File_And_Upload_To_S3(
  base64ImageString: string,
  date: string,
) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const base64Data = base64ImageString.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  const fileName = `image_${date}.jpg`;

  try {
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
        "What animals or objects do you see in this image? Please be specific but concise.",
        ...imageParts,
      ],
    });
    const analysis = response.text;

    return {
      fileName,
      analysis,
      success: true,
    };
  } catch (error: any) {
    console.error("Error analyzing image with Gemini:", error);
    return {
      fileName,
      analysis: null,
      success: false,
      error: error.message,
    };
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
  return {
    success: true,
    jistatus: getJiStatus(),
    ledstatus: getLedStatus(),
  };
});

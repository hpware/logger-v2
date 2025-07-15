import sql from "~/server/db/pg";
import { GoogleGenAI } from "@google/genai";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";

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
      region: "tw-home-1",
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
    const imageUrl = `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/uploads/${fileName}`;

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
    if (!deviceId || !fileName || !imageUrl || !jsonRes.item || !jsonRes.date) {
      throw new Error("One or more required values are undefined.");
    }
    await sql`
    INSERT INTO detect (device_id, imageURL, item, detected_at)
    VALUES (${deviceId}, ${fileName}, ${imageUrl}, ${jsonRes.item}, ${date})
    `;
    console.log({
      fileName,
      imageUrl,
      analysis,
      jsonRes,
      success: true,
    });
    return;
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
    return;
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
  const body = await readBody(event);
  if (!body || !body.deviceid) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Device ID is required.",
    });
  }
  uploadImages(body, body.deviceid as string);
  return "uploading";
});

/**
 * json
 * {
 *   "deviceid": "UUID",
 *   "image": [
 *     "data:image/jpeg;base64,/9j/4AAQSkZJRg
 *   ]
 * }
 */

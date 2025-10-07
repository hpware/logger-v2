import { withNetworkRetry } from "./retry";

interface NtfyNotification {
  message: string;
  priority?: number;
  tags?: string[];
  click?: string;
}

/**
 * Send notification to NTFY server
 * @param notification - The notification object
 * @returns Promise<boolean> - Whether the notification was sent successfully
 */
export async function sendNtfyNotification(
  notification: NtfyNotification,
  device_id: string
): Promise<boolean> {
  const { NTFY_URL, NTFY_TOPIC } = process.env;

  if (!NTFY_URL) {
    console.warn("NTFY_URL not configured, skipping notification");
    return false;
  }

  const payload = {
    topic: `camera_${device_id}_detections`,
    message: notification.message,
    title: "偵測新到物件",
    priority: notification.priority || 3,
    tags: notification.tags || ["camera", "detection"],
    ...notification.click && { click: notification.click }
  };

  try {
    await withNetworkRetry(
      async () => {
        const response = await fetch(`${NTFY_URL}/${payload.topic}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`NTFY request failed with status ${response.status}`);
        }

        return response;
      },
      {
        maxRetries: 3,
        delay: 1000,
        onRetry: (attempt, error) => {
          console.warn(`NTFY notification retry attempt ${attempt}:`, error.message);
        },
      },
    );

    console.log("NTFY notification sent successfully");
    return true;
  } catch (error) {
    console.error("Failed to send NTFY notification:", error);
    return false;
  }
}

/**
 * Send detection notification to NTFY
 * @param deviceId - The device ID
 * @param itemName - The detected item name
 * @param imageUrl - Optional image URL
 * @returns Promise<boolean> - Whether the notification was sent successfully
 */
export async function sendDetectionNotification(
  deviceId: string,
  itemName: string,
  detected_date?: string,
  imageUrl?: string,
): Promise<boolean> {
  const notification: NtfyNotification = {
    message: `在${detected_date || new Date().toLocaleString()}偵測到 ${itemName}`,
    priority: 4,
    tags: ["camera", "detection", "alert", "wildlife"],
    ...(imageUrl && { click: imageUrl })
  };

  return sendNtfyNotification(notification, deviceId);
}

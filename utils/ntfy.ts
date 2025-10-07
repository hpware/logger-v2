import { withNetworkRetry } from "./retry";

interface NtfyNotification {
  topic?: string;
  message: string;
  title?: string;
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
  notification: NtfyNotification
): Promise<boolean> {
  const { NTFY_URL, NTFY_TOPIC } = process.env;

  if (!NTFY_URL || !NTFY_TOPIC) {
    console.warn("NTFY_URL or NTFY_TOPIC not configured, skipping notification");
    return false;
  }

  const payload = {
    topic: notification.topic || NTFY_TOPIC,
    message: notification.message,
    title: notification.title || "AIOT Detection Alert",
    priority: notification.priority || 3,
    tags: notification.tags || ["camera", "detection"],
    ...(notification.click && { click: notification.click })
  };

  try {
    await withNetworkRetry(
      async () => {
        const response = await fetch(`${NTFY_URL}/${payload.topic}`, {
          method: "POST",
          body: payload.message,
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

export async function sendDetectionNotification(
  deviceId: string,
  itemName: string,
  detected_date?: string,
  imageUrl?: string,
): Promise<boolean> {
  console.log(`Sending detection notification for device ${deviceId}, item: ${itemName}`);
  const notification: NtfyNotification = {
    topic: `${deviceId}_detections`,
    title: "偵測新到物件",
    message: `在${detected_date || new Date().toLocaleString()}偵測到 ${itemName}`,
    priority: 4,
    tags: ["camera", "detection", "alert", "wildlife"],
    ...(imageUrl && { click: imageUrl })
  };

  return await sendNtfyNotification(notification);
}

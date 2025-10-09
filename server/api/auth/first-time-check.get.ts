import { getUserCount } from "~/server/utils/auth";

export default defineEventHandler(async () => {
  try {
    const userCount = await getUserCount();
    return {
      needsSetup: userCount === 0,
      userCount,
    };
  } catch (error) {
    console.error("First time check error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "無法檢查首次設定狀態",
    });
  }
});

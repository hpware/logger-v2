import { useAuth } from "./useAuth";

export function useFirstTimeSetup() {
  const { signUp } = useAuth();
  const showPopup = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const form = reactive({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const checkFirstTimeSetup = async () => {
    if (process.client) {
      try {
        // Check if this is the first visit and no users exist
        const isFirstTime = await $fetch("/api/auth/first-time-check", {
          method: "GET",
        });

        if (isFirstTime.needsSetup) {
          showPopup.value = true;
        }
      } catch (error) {
        console.error("First time setup check failed:", error);
      }
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      error.value = "請輸入姓名";
      return false;
    }

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      error.value = "請輸入有效的電子郵件地址";
      return false;
    }

    if (form.password.length < 6) {
      error.value = "密碼至少需要6個字符";
      return false;
    }

    if (form.password !== form.confirmPassword) {
      error.value = "密碼確認不匹配";
      return false;
    }

    error.value = null;
    return true;
  };

  const createFirstAccount = async () => {
    if (!validateForm()) return;

    isLoading.value = true;
    error.value = null;

    try {
      await signUp(form.name, form.email, form.password);
      showPopup.value = false;
      // Success will be handled by the auth composable (redirect to /admin)
    } catch (error: any) {
      error.value = error.data?.message || error.message || "帳戶創建失敗，請稍後再試";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    showPopup: readonly(showPopup),
    form,
    isLoading: readonly(isLoading),
    error: readonly(error),
    checkFirstTimeSetup,
    createFirstAccount,
    closePopup: () => showPopup.value = false,
  };
}

import { ref } from "vue";
import { login, type LoginResponse } from "./login.service";
import router from "@/router";
import { startOfflineCacheSession } from "@/utils/offline-cache";

export function useLoginController() {
  const email = ref("");
  const password = ref("");
  const backendError = ref("");
  const isSubmitting = ref(false);

  async function handleSubmit(): Promise<void> {
    backendError.value = "";
    isSubmitting.value = true;

    try {
      const response: LoginResponse = await login({
        email: email.value,
        password: password.value,
      });

      if (response.status >= 200 && response.status < 300) {
        await startOfflineCacheSession();
        await router.push({ name: "home" });
      }
    } catch (error) {
      if (error instanceof Error) {
        backendError.value = error.message;
      }
    } finally {
      isSubmitting.value = false;
    }
  }

  return { email, password, backendError, isSubmitting, handleSubmit };
}

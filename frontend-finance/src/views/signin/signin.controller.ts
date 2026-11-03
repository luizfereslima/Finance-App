import { ref } from "vue";
import { signin } from "./signin.service";
import router from "@/router";

export function useSigninController() {
  const name = ref("");
  const email = ref("");
  const password = ref("");
  const backendError = ref("");
  const isSubmitting = ref(false);

  async function handleSubmit() {
    backendError.value = "";
    isSubmitting.value = true;

    try {
      const response = await signin({
        name: name.value,
        email: email.value,
        password: password.value,
      });
      if (response.status >= 200 && response.status < 300) {
        await router.push({ name: "login" });
      }
    } catch (error) {
      if (error instanceof Error) {
        backendError.value = error.message;
      }
    } finally {
      isSubmitting.value = false;
    }
  }

  return { name, email, password, backendError, isSubmitting, handleSubmit };
}

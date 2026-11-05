import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { queryClient } from "./utils/vue-query.ts";
import {
  VueQueryPlugin,
  type VueQueryPluginOptions,
} from "@tanstack/vue-query";
import { forgetOfflineCacheSession } from "./utils/offline-cache";
const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClient: queryClient,
};
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin, vueQueryPluginOptions);

async function registerOfflineServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registrationReady = navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, {
        scope: import.meta.env.BASE_URL,
      })
      .then(() => navigator.serviceWorker.ready)
      .then(
        () => true,
        () => false,
      );
    let readyTimeout: number | undefined;
    const isReady = await Promise.race([
      registrationReady,
      new Promise<boolean>((resolve) => {
        readyTimeout = window.setTimeout(() => resolve(false), 1000);
      }),
    ]);

    if (readyTimeout !== undefined) {
      window.clearTimeout(readyTimeout);
    }

    if (!isReady) {
      return;
    }

    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => {
        const timeout = window.setTimeout(() => {
          navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
          resolve();
        }, 200);
        const onControllerChange = () => {
          window.clearTimeout(timeout);
          resolve();
        };

        navigator.serviceWorker.addEventListener("controllerchange", onControllerChange, {
          once: true,
        });
      });
    }
  } catch {
    // The app remains usable when service workers are unavailable.
  }
}

navigator.serviceWorker?.addEventListener("message", (event: MessageEvent) => {
  if (event.data?.type !== "API_CACHE_SESSION_EXPIRED") {
    return;
  }

  forgetOfflineCacheSession();
  queryClient.clear();
  void router.replace({ name: "login" });
});

void registerOfflineServiceWorker().finally(() => app.mount("#app"));

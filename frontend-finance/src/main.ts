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

navigator.serviceWorker?.addEventListener("message", (event: MessageEvent) => {
  if (event.data?.type !== "API_CACHE_SESSION_EXPIRED") {
    return;
  }

  forgetOfflineCacheSession();
  queryClient.clear();
  void router.replace({ name: "login" });
});

// O service worker é registrado pelo <UpdatePrompt /> (AppLayout).
app.mount("#app");

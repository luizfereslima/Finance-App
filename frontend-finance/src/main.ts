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
const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClient: queryClient,
};
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin, vueQueryPluginOptions);
app.mount("#app");

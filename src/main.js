import Vue from "vue";
import App from "./App.vue";

import vuetify from "@/plugins/vuetify";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import i18n from "./i18n";
import VueMask from "v-mask";
import store from "./store";
import Toast from "vue-toastification";

import "vue-toastification/dist/index.css";

const toastOptions = {
  timeout: Number(process.env.VUE_APP_TOAST_TIMEOUT),
  position: process.env.VUE_APP_TOAST_POSITION,
};

Vue.use(Toast, toastOptions);

Vue.use(VueMask);
Vue.prototype.$http = axios;
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount("#app");

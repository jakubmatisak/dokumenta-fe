import Vue from "vue";
import i18n from "@/i18n";
import router from "@/router";

export default {
  /**
   * If success show toast message and return response
   * otherwise if error status is 401 redirect to the login screen.
   * @param {String} type type of error
   * @param {Number} status number of status code
   */
  handleStatusCode(type, status) {
    if (status[0] === 2) {
      Vue.$toast(i18n.t(`statusCodes.${status}.${type}`), {
        toastClassName: "success-class",
      });
    } else if (status === 401) {
      sessionStorage.removeItem("vuex");
      if (router.app.$route.name === "Login") {
        Vue.$toast(i18n.t(`statusCodes.401.incorrect`), {
          toastClassName: "danger-class",
        });
      } else {
        Vue.$toast(i18n.t(`statusCodes.401.unauthorized`), {
          toastClassName: "danger-class",
        });
        router.app.$router.push({ name: "Login" });
      }
    } else {
      Vue.$toast(i18n.t(`statusCodes.${status}.${type}`), {
        toastClassName: "danger-class",
      });
    }
  },
};

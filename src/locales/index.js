import i18n from "@/i18n";

// eslint-disable-next-line valid-jsdoc
/**
 * translate function for dynamic bindings
 * @params {String} v - value to be translated
 */
export function translate(v) {
  return i18n.t("addressBook." + v);
}

export default {
  translate,
};

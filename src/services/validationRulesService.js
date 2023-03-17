import i18n from "@/i18n";
/* eslint require-jsdoc-except/require-jsdoc: "off" */
export default {
  rules: {
    required: (value) => !!value || i18n.t("validations.rules.required"),
    email: (value) => {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value) || i18n.t("validations.rules.email");
    },
    phone: (value) => {
      const pattern = /^(((\+?\d{1,3}\s?)\d{3})|\d{4})\s?\d{3}\s?\d{3}$/;
      return !value || pattern.test(value) || i18n.t("validations.rules.phone");
    },
    minField(n) {
      return (v) =>
        (!v || (v && v.length)) >= n ||
        i18n.tc("validations.rules.field.minLength", n);
    },
    maxField(n) {
      return (v) =>
        (!v || (v && v.length)) <= n ||
        i18n.tc("validations.rules.field.maxLength", n);
    },
    exactField(n) {
      return (v) =>
        (!v || (v && v.length)) === n ||
        i18n.tc("validations.rules.field.exactLength", n);
    },
    minPassword(n) {
      return (v) =>
        (!v || (v && v.length)) >= n ||
        i18n.tc("validations.rules.password.minLength", n);
    },
    patternPassword: (v) => {
      const pattern =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/;
      return (
        !v || pattern.test(v) || i18n.tc("validations.rules.password.pattern")
      );
    },
    date: (v) => {
      const pattern =
        /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})$/;
      return !v || pattern.test(v) || i18n.t("validations.rules.date");
    },
    number: (v) => {
      const pattern = /^[0-9]*$/;
      return !v || pattern.test(v) || i18n.t("validations.rules.number");
    },
    noSpecialChars() {
      return [
        (v) =>
          /^[a-zA-Z0-9À-ž- _]*$/.test(v) ||
          i18n.t("validation.rules.noSpecialChars"),
      ];
    },
  },

  /**
   * Get array of rules from @this rules, whitch name is same as string in @param arrayOfRules.
   * @param {Array} arrayOfRules Array of strings. Every string is name of rule from @this rules.
   * @returns {Array} rules
   */
  getRules(arrayOfRules) {
    let rules = [];

    if (arrayOfRules && arrayOfRules.length > 0) {
      arrayOfRules.forEach((rule) => {
        if (rule.includes("-")) {
          const chars = rule.split("-");
          rules.push(this.rules[chars[0]](parseInt(chars[1])));
        } else if (rule && this.rules[rule]) {
          rules.push(this.rules[rule]);
        }
      });
    }
    return rules;
  },
};

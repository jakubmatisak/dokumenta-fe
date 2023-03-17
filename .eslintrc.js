module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/strongly-recommended",
    "plugin:vue/essential",
    "plugin:vue/recommended",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "require-jsdoc-except/require-jsdoc": [
      "error",
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: true,
          FunctionExpression: true,
        },
        ignore: [
          "data",
          "loadLocaleMessages",
          "created",
          "mounted",
          "validator",
          "counter",
        ],
      },
    ],
    "valid-jsdoc": [
      "error",
      {
        requireParamType: true,
        requireParamDescription: true,
        requireReturn: false,
        requireReturnType: true,
        requireReturnDescription: true,
        matchDescription: ".+",
      },
    ],
  },
  plugins: ["prettier", "require-jsdoc-except"],
};

import axiosService from "@/services/axiosService";

/**
 * Create FormData from body object, then call specific PUT API from
 * axiosService. Function uses "application/octet-stream" as default
 * content-type header.
 * @param {String} url API path
 * @param {Object} body Payload. Default is empty Object
 * @param {Object} options Can contain the following keys:
 *   @prop {Object} options.alert Sets toast messages.
 *     @prop {Boolean} alert.success Show/Hide success response toast message.
 *     @prop {Boolean} alert.failure Show/Hide error toast message.
 *   @prop {Boolean} options.auth Sets a "Authorization" header with a "Bearer"
 *   token stored in "localStorage" under the key "authorization" in each axios
 *   call. If equal to false, the Authorization header will not be set.
 *   @prop {Object} options.headers The headers mentioned in this object will
 *   be set via @function setHeader() to the axios call.
 *   @prop {String} options.responseType Set the response type to axios call
 *   options. If it is not filled in, will be set to the default value "json".
 *
 * @returns {Promise} PUT api from axiosService.
 */
export async function updateFile(url, body = {}, options = {}) {
  options.headers = options.headers || {
    "Content-Type": "application/octet-stream",
  };

  let formData = new FormData();

  Object.keys(body).forEach((key) => {
    formData.append(key, body[key]);
  });

  return await axiosService.put(url, formData, options);
}

/**
 * Function uses responseType: "blob". Call GET API from axiosService, then
 * create anchor element with response url and download file.
 * @param {*} extension ...
 * @param {String} url API path
 * @param {Object} options Can contain the following keys:
 *   @prop {Object} options.alert Sets toast messages.
 *     @prop {Boolean} alert.success Show/Hide success response toast message.
 *     @prop {Boolean} alert.failure Show/Hide error toast message.
 *   @prop {Boolean} options.auth Sets a "Authorization" header with a "Bearer"
 *   token stored in "localStorage" under the key "authorization" in each axios
 *   call. If equal to false, the Authorization header will not be set.
 *   @prop {Object} options.headers The headers mentioned in this object will
 *   be set via @function setHeader() to the axios call.
 *   @prop {String} options.responseType Set the response type to axios call
 *   options. If it is not filled in, will be set to the default value "json".
 *
 * @returns  {Promise} GET api from axiosService.
 */
export async function downloadFile(extension, url, options = {}) {
  options.responseType = options.responseType || "blob";

  return await axiosService
    .get(url, options)
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", extension);
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      throw error;
    });
}

export default {
  updateFile,
  downloadFile,
};

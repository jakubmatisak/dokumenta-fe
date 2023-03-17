import axios from "axios";
import store from "@/store";
import errorHandleService from "@/services/errorHandleService";

const axiosClient = axios.create({
  baseURL: process.env.VUE_APP_API,
  //withCredentials: process.env.VUE_APP_WITH_CREDENTIALS,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Call specific checklist API. If success set checklist to the Vuex, otherwise
 * handle error if @var options.alert.failure is not false and throw error.
 * @param {String} url API path
 * @param {String} name Checklist name used as key in object of all checklists
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
 */
export async function getChecklist(url, name, options = {}) {
  await axiosClient
    .get(url, {
      /*headers: setHeader(options.headers, options.auth)*/
    })
    .then((response) => {
      store.dispatch(`setChecklist`, {
        key: name,
        data: response.data,
        status: response.status,
      });
    })
    .catch((error) => {
      if (!options.alert || options.alert.failure !== false) {
        console.log(error);
        errorHandleService.handleStatusCode("get", error.response.status);
      }
      throw error;
    });
}

/**
 * Call specific GET API. If success handle status code
 * if @var options.alert.success is true and return response, otherwise handle
 * error if @var options.alert.failure is not false and throw error.
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
 * @returns {Promise} response or error from API
 */
export async function get(url, options = {}) {
  return await axiosClient
    .get(url, {
      // headers: setHeader(options.headers, options.auth),
      responseType: options.responseType || "json",
    })
    .then((response) => {
      if (options.alert && options.alert.success) {
        errorHandleService.handleStatusCode("get", response.status);
      }
      return response;
    })
    .catch((error) => {
      if (!options.alert || options.alert.failure !== false) {
        errorHandleService.handleStatusCode("get", error.response.status);
      }
      throw error;
    });
}

/**
 * Call specific POST API. If success handle status code
 * if @var options.alert.success is not false and return response, otherwise
 * handle error if @var options.alert.failure is not false and throw error.
 * @param {String} url API path
 * @param {Object} body Payload, default is null
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
 * @returns {Promise} response or error from API
 */
export async function post(url, body = null, options = {}) {
  return await axiosClient
    .post(url, body, {
      /*headers: setHeader(options.headers, options.auth)*/
    })
    .then((response) => {
      if (!options.alert || options.alert.success !== false) {
        errorHandleService.handleStatusCode("post", response.status);
      }
      return response;
    })
    .catch((error) => {
      if (!options.alert || options.alert.failure !== false) {
        errorHandleService.handleStatusCode("post", error.response.status);
      }
      throw error;
    });
}

/**
 * Call specific PUT API. If success handle status code
 * if @var options.alert.success is true and return response, otherwise handle
 * error if @var options.alert.failure is not false and throw error.
 * @param {String} url API path
 * @param {Object} body Payload
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
 * @returns {Promise} response or error from API
 */
export async function put(url, body, options = {}) {
  return await axiosClient
    .put(url, body, {
      /*headers: setHeader(options.headers, options.auth)*/
    })
    .then((response) => {
      if (options.alert && options.alert.success) {
        errorHandleService.handleStatusCode("put", response.status);
      }
      return response;
    })
    .catch((error) => {
      if (!options.alert || options.alert.failure !== false) {
        errorHandleService.handleStatusCode("put", error.response.status);
      }
      throw error;
    });
}

/**
 * Call specific POST API. If success handle status code
 * if @var options.alert.success is not false and return response, otherwise
 * handle error if @var options.alert.failure is not false and throw error.
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
 * @returns {Promise} response or error from API
 */
export async function destroy(url, options = {}) {
  return await axiosClient
    .delete(url, {
      /*headers: setHeader(options.headers, options.auth)*/
    })
    .then((response) => {
      if (!options.alert || options.alert.success !== false) {
        errorHandleService.handleStatusCode("delete", response.status);
      }
      return response;
    })
    .catch((error) => {
      if (!options.alert || options.alert.failure !== false) {
        errorHandleService.handleStatusCode("delete", error.response.status);
      }
      throw error;
    });
}

/**
 * Set custom headers options or use default.
 * @param {Object} headers Custom headers. Content-Type: application/json by
 * default.
 * @param {Boolean} auth Authorization header true/false. True by default.
 * @returns {Object} headers
 */
/*function setHeader(headers, auth = true) {
  if (auth) {
    headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("authorization")).Token
    }`;
  }

  return headers;
}*/

export default {
  getChecklist,
  get,
  post,
  put,
  destroy,
};

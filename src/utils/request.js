/** @module utils/request */

/**
 * ajax 호출을 시행한다.
 *
 * @param {object} param
 * @param {'get'|'post'|'put'|'delete'=} param.method
 * @param {string} param.url
 */
export default function request({ method = 'get', url }) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.open(method, url);
    xhr.send();
  });
}

/** @module utils/request */

/**
 * ajax 호출을 시행한다.
 */
export default function request({
  method = 'get',
  url,
}: {
  method?: 'get' | 'post' | 'put' | 'delete';
  url: string;
}): Promise<XMLHttpRequest['response']> {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.open(method, url);
    xhr.send();
  });
}

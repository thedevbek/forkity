import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

/**
 * The `timeout` function returns a promise that rejects with an error if a request takes longer than
 * the specified time.
 * @param s - The parameter `s` represents the number of seconds after which the timeout should occur.
 * @returns The `timeout` function returns a Promise object.
 */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};


/**
 * The AJAX function is a helper function that sends an HTTP request to a specified URL and returns the
 * response data.
 * @param url - The `url` parameter is the URL of the API endpoint that you want to make a request to.
 * It can be a relative or absolute URL.
 * @param [uploadData] - The `uploadData` parameter is an optional parameter that represents the data
 * that you want to send to the server when making a POST request. It is an object that will be
 * converted to JSON format using `JSON.stringify()` before sending it in the request body. If
 * `uploadData` is not provided
 * @returns the data received from the server.
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

// import fetch from 'whatwg-fetch';
import { actions } from 'mirrorx';
import { notification, Modal } from 'antd';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    return response.json().then((result) => {
      notification.error({
        message: response.name,
        description: result.message
      });

      if (result.stack) {
        notification.error({
          message: '请求错误',
          description: result.message
        });
      }

      const error = new Error(result.message);
      error.response = response;
      throw error;
    });
  }
}

function checkCode(result) {
  if (result.code !== 200 && result.code !== 800) {
    if (result.code === 401) {
      actions.routing.push('/user/login');
    }
    Modal.warning({
      title: result.msg,
    });
  }
  return result;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
    mode: 'cors'
  };

  const newOptions = {
    ...defaultOptions,
    ...options
  };

  newOptions.method = options.method.toUpperCase();

  if (newOptions.method === 'GET') {
    newOptions.body = undefined;
    
    let dataStr = '';
    Object.keys(options.body).forEach(key => {
      dataStr += key + '=' + options.body[key] + '&';
    })
   
    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
  }

  if (newOptions.method === 'POST' || newOptions.method === 'DELETE' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => response.json())
    .then(checkCode)
    .catch((err) => ({
      err
    }));
}

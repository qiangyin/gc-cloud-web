import request from '../utils/request';
import api from '../commons/api';

// login
export function loginRequest(params) {
  return request(api.login, {
    method: 'POST',
    body: params
  });
}

// logout
export function logoutRequest(params) {
  return request(api.logout, {
    method: 'POST',
    body: params
  });
}
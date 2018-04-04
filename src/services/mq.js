import request from '../utils/request';
import api from '../commons/api';

export function zoneRequest(params) {
  return request(api.getMiddleWareZone, {
    method: 'GET',
    body: params
  });
}

export function envRequest(params) {
  return request(api.getMiddleWareEnv, {
    method: 'GET',
    body: params
  });
}

export function groupRequest(params) {
  return request(api.managerConsumeGroupId, {
    method: 'GET',
    body: params
  });
}
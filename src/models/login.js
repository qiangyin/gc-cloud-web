import { actions } from 'mirrorx';
import request from '../utils/request';
import api from '../commons/api';
import { loginRequest, logoutRequest } from '../services/app';

const initialState = {
  submitting: false,
  info: null
};

export default {
  name: 'login',

  initialState: initialState,

  reducers: {
    unmount(state, data) {
      return { ...initialState };
    },

    showLoading(state, data) {
      return { ...state, submitting: true };
    },

    hideLoading(state, data) {
      return { ...state, submitting: false };
    },
    // login
    handleLoginResult(state, data) {
      return { ...state, info: data };
    },
    // logout
    handleLogoutResult(state, data) {
      return { ...state, info: null };
    },
  },

  effects: {
    async loginRequest(data, getState) {
      actions.login.showLoading();
      const res = await loginRequest(data);
      actions.login.hideLoading();
      if (res) {
        actions.login.handleLoginResult(res);
        if (res.body) {
          localStorage.setItem('userInfo', JSON.stringify(res.body));
        }
      }
    },

    async logout(data, getState) {
      const res = await logoutRequest(data);
      actions.login.handleLogoutResult(res);
      actions.user.removeCurrentUserInfo(res);
      actions.routing.push('/user/login');
    },
  }
};

import { actions } from 'mirrorx';
import request from '../utils/request';
import api from '../commons/api';
import { loginRequest, logoutRequest } from '../services/app';

const initialState = {
  isAuth: false
};

export default {
  name: 'console',

  initialState: initialState,

  reducers: {
    unmount(state, data) {
      return { ...initialState };
    },
    // login
    handleLoginResult(state, data) {
      return { ...state, ...data};
    },

  },

  effects: {
    async loginRequest(pwd, getState) {
      const {user} = getState()
      const res = await loginRequest({
        userName: user.currentUserInfo.samAccountName,
        password: pwd,
        domainType: user.currentUserInfo.domainType + ''
      });
      if (res) {
        if (res.body) {
          actions.console.handleLoginResult({
            isAuth: true
          });
        }
      }
    },
  }
};

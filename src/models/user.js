import { actions } from 'mirrorx';
import request from '../utils/request';
import api from '../commons/api';
// 声明 Redux state, reducer 和 action，
// 所有的 action 都会以相同名称赋值到全局的 actions 对象上
const initialState = {
  currentUser: {
    name: 'lvhaohua',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
    userid: '0000001',
    notifyCount: 101
  },
  currentUserInfo: {
    realName: ''
  }
};

export default {
  name: 'user',

  initialState: initialState,

  reducers: {

    saveCurrentUser(state, data) {
      return {
        ...state,
        currentUser: data.payload,
      };
    },
    handleUserInfo(state, data) {
      return {
        ...state,
        currentUserInfo: data,
      }
    },
    removeUserInfo(state, data) {
      return {
        ...state,
        currentUserInfo: {},
      }
    }
  },

  effects: {
    async getCurrentUserInfo(data, getState) {
      const userInfo = await localStorage.getItem('userInfo');
      if (userInfo) {
        actions.user.handleUserInfo(JSON.parse(userInfo));
      } else {
        // actions.routing.push('/user/login');
      }
    },

    async removeCurrentUserInfo(data, getState) {
      localStorage.removeItem('userInfo');
      actions.user.removeUserInfo();
    }
  }
};

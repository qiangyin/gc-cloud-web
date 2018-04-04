import { actions } from 'mirrorx';
import request from '../utils/request';
import api from '../commons/api';
// 声明 Redux state, reducer 和 action，
// 所有的 action 都会以相同名称赋值到全局的 actions 对象上
export default {
  name: 'dashboard',

  initialState: {
    collapsed: false,
    notices: [],
    fetchingNotices: false
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    }
  },

  effects: {
    
  }
};

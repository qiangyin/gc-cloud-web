import { actions } from 'mirrorx';
import request from '../utils/request';
import api from '../commons/api';
import { Map, fromJS, merge } from 'immutable';
import { Modal } from 'antd';

const initialState = {
  loading: false,
  modalIsShow: false,
  dataParams: {
    id: null,
    name: '',
    describe: ''
  },
  tableData: [],
  reConstructData: [],
  modalProcessData: null,
};

export default {
  name: 'construct',

  initialState: initialState,

  reducers: {
    unmount(state, data) {
      return { ...initialState };
    },

    showLoading(state, data) {
      return { ...state, loading: true };
    },

    hideLoading(state, data) {
      return { ...state, loading: false };
    },

    showModal(state, data) {
      return { ...state, modalIsShow: data };
    },

    setDataParams(state, data) {
      return fromJS(state)
        .setIn(['dataParams'], Map(state.dataParams).merge(Map(data)))
        .toJS()
    },

    clearDataParams(state, data) {
      return fromJS(state)
        .setIn(['dataParams'], {})
        .toJS()
    },

    handleReConstructResult(state, data){
      return fromJS(state)
        .setIn(['reConstructData'], {})
        .toJS()
    },

    // table
    handleTableResult(state, data) {
      return fromJS(state)
        .setIn(['tableData'], data)
        .toJS()
    },
  },

  effects: {
    async getTableData(data, getState) {
      actions.construct.showLoading();
      const params = data || {};
      const res = await request(api.construct, {
        method: 'GET',
        body: params
      });
      if (res.code === 200 && res.data.list) {
        actions.construct.handleTableResult(res.data.list);
        actions.construct.hideLoading();
      }
    },

    async startUp(data, getState){
      actions.construct.showLoading();
      const reqApi = api.construct + `${data}/startup`
      const res = await request(reqApi, {
        method: 'GET',
        body: {}
      });
      if (res.code === 200) {
        console.log("res: ", res);
        // actions.construct.handleReConstructResult(res.data);
        actions.construct.hideLoading();
        setTimeout(() =>actions.construct.getTableData(), 1000);
      }
    },

    async addApp(data, getState) {
      const params = data || getState().construct.dataParams;
      const res = await request(api.construct, {
        method: 'POST',
        body: params
      });
      actions.construct.showModal(false);
      if (res.code === 200 && res.body) {
        const modal = Modal.success({
          title: '添加成功',
        });
        setTimeout(() => modal.destroy(), 1000);
        actions.construct.getTableData();
      }
    }
  }
};

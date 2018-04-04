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
    des: ''
  },
  tableData: [],
  modalProcessData: null,
};

export default {
  name: 'appMgmt',

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

    // table
    handleTableResult(state, data) {
      return fromJS(state)
        .setIn(['tableData'], data)
        .toJS()
    },
  },

  effects: {
    async getTableData(data, getState) {
      actions.appMgmt.showLoading();
      const params = data || {};
      const res = await request(api.project, {
        method: 'GET',
        body: params
      });
      if (res.code === 200 && res.data.list) {
        actions.appMgmt.handleTableResult(res.data.list);
        actions.appMgmt.hideLoading();
      }
    },

    async addApp(data, getState) {
      const params = data || getState().appMgmt.dataParams;
      const res = await request(api.project, {
        method: 'POST',
        body: params
      });
      actions.appMgmt.showModal(false);
      if (res.code === 200 && res.data) {
        const modal = Modal.success({
          title: '添加成功',
        });
        setTimeout(() => modal.destroy(), 1000);
        actions.appMgmt.getTableData();
      }
    }
  }
};

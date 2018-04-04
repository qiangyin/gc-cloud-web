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
  baseData: [],
  modalProcessData: null,
  logs: [],
  logModalVisable: false,
  podName: ''
};

export default {
  name: 'serveDetail',

  initialState: initialState,

  reducers: {
    unmount(state, data) {
      return { ...initialState };
    },

    updateState(state, data) {
      return {...state, ...data};
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

    // baseInfo
    handleBaseInfoResult(state, data){
      return fromJS(state)
      .setIn(['baseData'], data)
      .toJS()
    }
  },

  effects: {

    async getLog(data, getState) {
      let {nameSpace, podName} = data
      const res = await request(`${api.serve}${nameSpace}/${podName}/logs`, {
        method: 'GET',
        body: {}
      });
      if (res.code === 200 && res.data) {
        actions.serveDetail.updateState({
          logs: res.data.split('<br>'),
          logModalVisable: true
        })
      }
    },

    async getTableData(data, getState) {
      actions.serveDetail.showLoading();
      let datas = {'param': data}
      const params = datas || {};
      let requestApi = api.serve+`${data}/instanceList`;
      const res = await request(requestApi, {
        method: 'GET',
        body: {}
      });
      if (res.code === 200 && res.data) {
        actions.serveDetail.handleTableResult(res.data);
        actions.serveDetail.hideLoading();
      }
    },

    async getBaseData(data, getState) {
      actions.serveDetail.showLoading();
      let datas = {'param': data}
      const params = datas || {};
      let reqBaseApi = api.serve + `${data}/info`;
      const resBase = await request(reqBaseApi, {
        method: 'GET',
        body: {}
      });
      if (resBase.code === 200 && resBase.data) {
        actions.serveDetail.handleBaseInfoResult(resBase.data);
        actions.serveDetail.hideLoading();
      }
    },

    async addApp(data, getState) {
      const params = data || getState().serveDetail.dataParams;
      const res = await request(api.serve, {
        method: 'POST',
        body: params
      });
      actions.serveDetail.showModal(false);
      if (res.code === 200 && res.body) {
        const modal = Modal.success({
          title: '添加成功',
        });
        setTimeout(() => modal.destroy(), 1000);
        actions.serveDetail.getTableData();
      }
    }
  }
};

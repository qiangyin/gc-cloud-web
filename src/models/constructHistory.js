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
  detailData: [],
  splitData: [],
  configData: [],
  modalProcessData: null,
  logs: [],
  logModalVisable: false
};

export default {
  name: 'constructHistory',

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

    handleDetailResult(state, data) {
      return fromJS(state)
        .setIn(['detailData'], data)
        .setIn(['configData'], data.buildConfig)
        .toJS()
    },

    handleSplitResult(state, data) {
      const arrSp = data.imageName.split(":")
      return fromJS(state)
        .setIn(['splitData'], arrSp)
        .toJS()
    },

  },

  effects: {

    async getLog(data, getState) {
      let {projectId, buildId} = data
      const res = await request(`${api.construct}${projectId}/${buildId}/log`, {
        method: 'GET',
        body: {}
      });
      if (res.code === 200 && res.data) {
        actions.constructHistory.updateState({
          logs: res.data.split('\n'),
          logModalVisable: true
        })
      }
    },

    async getTableData(data, getState) {
      actions.constructHistory.showLoading();
      const param = {"pageSize": 1000, "pageNum": 1}
      const params = param || {};
      const res = await request(api.historyList, {
        method: 'GET',
        body: params
      });
      if (res.code === 200 && res.data.list) {
        actions.constructHistory.handleTableResult(res.data.list);
        actions.constructHistory.hideLoading();
      }
    }
  }
};

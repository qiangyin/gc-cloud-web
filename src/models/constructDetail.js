import {actions} from 'mirrorx';
import request from '../utils/request';
import api from '../commons/api';
import {Map, fromJS, merge} from 'immutable';
import {Modal} from 'antd';

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
  name: 'constructDetail',

  initialState: initialState,

  reducers: {
    unmount(state, data) {
      return {...initialState};
    },

    updateState(state, data) {
      return {...state, ...data};
    },

    showLoading(state, data) {
      return {...state, loading: true};
    },

    hideLoading(state, data) {
      return {...state, loading: false};
    },

    showModal(state, data) {
      return {...state, modalIsShow: data};
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
      if (data.imageName){
        const arrSp = data.imageName.split(":")
        return fromJS(state)
        .setIn(['splitData'], arrSp)
        .toJS()
      }
      const defaultVersion = ''
      return fromJS(state)
      .setIn(['splitData'], defaultVersion)
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
        actions.constructDetail.updateState({
          logs: res.data.split('\n'),
          logModalVisable: true
        })
      }
    },

    async getTableData(data, getState) {
      actions.constructDetail.showLoading();
      const param = {'projectId': data, "pageSize": 1000, "pageNum": 1}
      const params = param || {};
      const reqHistory = api.historyList + `/${data}`
      const res = await request(reqHistory, {
        method: 'GET',
        body: params
      });
      if (res.code === 200 && res.data.list) {
        actions.constructDetail.handleTableResult(res.data.list);
        actions.constructDetail.hideLoading();
      }
    },

    async getDetailData(data, getState) {
      actions.constructDetail.showLoading();
      let datas = {'param': data}
      const params = datas || {};
      let reqDetail = api.construct + `${data}`
      const res = await request(reqDetail, {
        method: 'GET',
        body: {}
      });
      if (res.code === 200 && res.data) {
        actions.constructDetail.handleDetailResult(res.data);
        actions.constructDetail.handleSplitResult(res.data.buildConfig);
        actions.constructDetail.hideLoading();
      }
    },

    async addApp(data, getState) {
      const params = data || getState().constructDetail.dataParams;
      const res = await request(api.serve, {
        method: 'POST',
        body: params
      });
      actions.constructDetail.showModal(false);
      if (res.code === 200 && res.body) {
        const modal = Modal.success({
          title: '添加成功',
        });
        setTimeout(() => modal.destroy(), 1000);
        actions.constructDetail.getTableData();
      }
    }
  }
};

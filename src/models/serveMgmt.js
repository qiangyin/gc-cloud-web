import {
  actions
} from 'mirrorx';
import request from '../utils/request';
import api from '../commons/api';
import {
  Map,
  fromJS,
  merge
} from 'immutable';
import {
  Modal
} from 'antd';

const initialState = {
  loading: false,
  modalIsShow: false,
  dataParams: {
    id: null,
    name: '',
    describe: ''
  },
  tableData: [],
  // stopData: [],
  modalProcessData: null,
};

export default {
  name: 'serveMgmt',

  initialState: initialState,

  reducers: {
    unmount(state, data) {
      return { ...initialState
      };
    },

    showLoading(state, data) {
      return { ...state,
        loading: true
      };
    },

    hideLoading(state, data) {
      return { ...state,
        loading: false
      };
    },

    showModal(state, data) {
      return { ...state,
        modalIsShow: data
      };
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

    handleStartResult(state, data) {
      return fromJS(state)
        .setIn(['data'], data)
        .toJS()
    },

    handleStopResult(state, data) {
      return fromJS(state)
        .setIn(['data'], data)
        .toJS()
    },

  },

  effects: {
    async getTableData(data, getState) {
      actions.serveMgmt.showLoading();
      const params = data || {};
      const res = await request(api.serveList, {
        method: 'GET',
        body: params
      });
      console.log(res);
      if (res.code === 200 && res.data.list) {
        actions.serveMgmt.handleTableResult(res.data.list);
        actions.serveMgmt.hideLoading();
      }
    },

    async addApp(data, getState) {
      const params = data || getState().serveMgmt.dataParams;
      const res = await request(api.serve, {
        method: 'POST',
        body: params
      });
      actions.serveMgmt.showModal(false);
      if (res.code === 200 && res.body) {
        const modal = Modal.success({
          title: '添加成功',
        });
        setTimeout(() => modal.destroy(), 1000);
        actions.serveMgmt.getTableData();
      }
    },

    async getStartData(data, getState) {
      actions.serveMgmt.showLoading();
      const params = data || {};
      let reqStart = api.serveStart + `${params}/start`;
      const res = await request(reqStart, {
        method: 'GET',
        body: {}
      });
      if (res.code === 200) {
        const tData = getState().serveMgmt.tableData;
        for (let i=0; i < tData.length; i++){
          if (tData[i].serviceName != null && tData[i].serviceName === data){
            tData[i].serviceStatus = 0
          }
        }
        actions.serveMgmt.hideLoading();
      }
    },

    async getStopData(data, getState) {
      actions.serveMgmt.showLoading();
      const params = data || {};
      let reqStop = api.serveStart + `${params}/stop`;
      const res = await request(reqStop, {
        method: 'GET',
        body: {}
      });
      if (res.code === 200) {
        const tData =  getState().serveMgmt.tableData;
        for (let i=0; i < tData.length; i++){
          if (tData[i].serviceName != null && tData[i].serviceName === data){
            tData[i].serviceStatus = 1
          }
        }
        actions.serveMgmt.hideLoading();
      }
    },

  }
};

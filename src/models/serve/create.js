import {actions} from 'mirrorx';
import request from '../../utils/request';
import api from '../../commons/api';
import {Map, fromJS, merge} from 'immutable';
import {Modal, Message, message} from 'antd';

const initialState = {
  loading: false,
  data: [],
  current: 0,
  submitBtnStatus: false,
  steps: [{
    title: '选择镜像',
    fields: {
      imageStoreName: {},
    }
  }, {
    title: '基础设置',
    fields: {
      imageStoreName: {},
      imageName: {},
      imageVersion: {},
      serviceName: {},
      projectName: {},
      serviceConfigId: {},
      deployMode: {
        value: 'Deployment'
      }
    }
  }, {
    title: '高级设置',
    fields: {
      serviceType: {
        value: '无状态化服务'
      },
      maxReplicas: {},
      minReplicas: {},
      targetCPUUtilizationPercentage: {},
    }
  }],
  projectList: [],
  harborProjects: [],
  harborRepositories: [],
  haborTags: [],
  targetCPUUtilizationPercentageList: [{
    value: 10
  }],
  serviceConfigList:[]
}

export default {
  name: 'serveCreate',

  initialState: fromJS(initialState).toJS(),

  reducers: {
    unmount(state, data) {
      return {...initialState};
    },

    updateState(state, data) {
      return {...state, ...data};
    },

    updateSteps(state, data) {
      let {current} = state
      let {steps} = data
      let stepValidator = Object
        .keys(steps[current].fields)
        .every(item => {
          let field = steps[current].fields[item]
          return field.value !== undefined && field.value !== ''
        })
      return {...state, ...data, submitBtnStatus: stepValidator};
    },

    updateCurrent(state, data) {
      return {...state, ...data};
    },

    closeDetailModal(state) {
      return {
        ...state,
        modalVisiable: false,
        // detail: null
      }
    }
  },

  effects: {
    async getProjectList(data = {}, getState) {
      const res = await request(api.projectList, {
        method: 'GET',
        body: {}
      });
      if (res.code === 200) {
        actions.serveCreate.updateState({
          projectList: res.data.list
        })
      }
    },

    async serviceConfigList(data = {}, getState) {
      const res = await request(api.serviceConfigList, {
        method: 'GET',
        body: {}
      });
      if (res.code === 200) {
        actions.serveCreate.updateState({
          serviceConfigList: res.data
        })
      }
    },

    async getGitlabGroupsProjects(data = {}, getState) {
      let groupId = 2
      const res = await request(`${api.gitlabGroups}/${groupId}/projects`, {
        method: 'GET',
        body: {}
      });
      if (res.code === 200) {
        actions.serveCreate.updateState({
          groupsProjects: res.data
        })
      }
    },

    async gitlabProjectsBranches(data = {}, getState) {
      let {projectId} = data
      const res = await request(`${api.gitlabProjects}/${projectId}/repository/branches`, {
        method: 'GET',
        body: {}
      });
      if (res.code === 200) {
        actions.serveCreate.updateState({
          branches: res.data
        })
      }
    },

    async getImageProjects(data = {}, getState) {
      const res = await request(api.getHarborProjects, {
        method: 'GET',
        body: {
          is_public: 1,
          page: 1,
          page_size: 1000,
          project_name: ''
        }
      });
      if (res.code === 200) {
        actions.serveCreate.updateState({
          harborProjects: res.data
        })
      }
    },

    async getHaborTags(data = {}, getState) {
      let {steps} = getState().serveCreate
      let {imageName} = data
      let imageStoreName = steps[1].fields.imageStoreName.value
      let url = `${api.getHaborTags}/${imageName}`
      const res = await request(url, {
        method: 'GET',
        body: {}
      });
      if (res.code === 200) {

        actions.serveCreate.updateState({
          haborTags: res.data
        })
      }
    },

    async getHaborRepositories(data = {}, getState) {
      let {project_id} = data
      let {steps} = getState().serveCreate
      let imageStoreName = steps[0].fields.imageStoreName.value
      steps[1].fields.imageStoreName.value = imageStoreName
      const res = await request(api.getHaborRepositories, {
        method: 'GET',
        body: {
          project_id,
          q: 1,
          page: 1,
          detail: 1,
          page_size: 1000
        }
      });
      if (res.code === 200) {
        actions.serveCreate.updateState({
          harborRepositories: res.data,
          steps
        })
      }
    },

    async stepButtonOp(data, getState) {
      let {type} = data
      let {current, steps, harborProjects} = getState().serveCreate
      let newCurrent = type === 'next' ? (current + 1) : (current - 1)
      let stepValidator = Object.keys(steps[newCurrent].fields).every(item => steps[newCurrent].fields[item].value !== undefined && steps[newCurrent].fields[item].value !== '')

      if (newCurrent === 1 && type === 'next') {
        actions.serveCreate.getHaborRepositories({
          project_id: harborProjects.filter(item => item.name === steps[0].fields.imageStoreName.value)[0].projectId
        })
      }
      actions.serveCreate.updateCurrent({
        current: newCurrent,
        submitBtnStatus: stepValidator
      })

    },

    async getProjectBranches(data = {}, getState) {
      let {projectId} = data
      const res = await request(`${api.projects}/${projectId}/repository/branches`, {
        method: 'GET',
        body: {}
      });
      if (res.code === 200) {
        actions.serveCreate.updateState({
          projectBranches: res.body
        })
      }
    },

    async serveCreate(data = {}, getState) {
      let {steps, serviceConfigList, projectList} = getState().serveCreate
      let params = {
        // "cpu": 2,
        // "deployMode": "deployment",
        // "imageName": "bbb",
        // "imageStoreName": "aaaa",
        // "imageVersion": "v1.0.0",
        // "maxReplicas": 5,
        // "memory": 8,
        // "minReplicas": 1,
        // "projectName": "test",
        // "projectId": 1,
        // "serviceName": "test",
        // "serviceType": 0,
        // "targetCPUUtilizationPercentage": 10
      }
      steps.forEach(item => {
        Object.keys(item.fields).forEach(field => {
          let value = item.fields[field].value
          if(field === 'projectName') {
            params['projectId'] = projectList.filter(item => item.name === value)[0].id
          }
          if (value) params[field] = value
        })
      })

      let  serviceConfig = serviceConfigList.filter(item => item.id === params.serviceConfigId)[0]
      params = {
        ...params,
        cpu: serviceConfig.cpu,
        memory: serviceConfig.mem,
      }
      const res = await request(`${api.serveCreate}`, {
        method: 'POST',
        body: params
      });
      if (res.code === 200) {
        message.success('创建成功')
        actions.routing.push('/serve/servelist')
      }
    },
  }
};

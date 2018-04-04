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
    title: '填写基本信息',
    fields: {
      projectId: {
        value: undefined,
      },
    }
  }, {
    title: '配置代码仓库',
    fields: {
      repositoryType: {
        value: 'git',
      },
      codeRepository: {},
      codeBranch: {},
      buildDirectory: {value: '/target/'},
      buildName: {},
    }
  }, {
    title: '配置持续集成',
    fields: {
      buildLanguage: {
        value: undefined,
      },
      languageVersion: {
        value: undefined,
      },
    }
  }, {
    title: '配置镜像仓库',
    fields: {
      imageRepository: {},
      imageName: {},
      exposePort: {},
    }
  }],
  projectList: [],
  runtimeList: [],
  groupsProjects: [],
  branches: [],
  imageRepositorys: []
};

export default {
  name: 'buildCreate',

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
      console.log(initialState)
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
        actions.buildCreate.updateState({
          projectList: res.data.list
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
        actions.buildCreate.updateState({
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
        actions.buildCreate.updateState({
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
        actions.buildCreate.updateState({
          imageRepositorys: res.data
        })
      }
    },

    async getRuntimeList(data = {}, getState) {
      const res = await request(api.runtimeList, {
        method: 'GET',
        body: {}
      });
      if (res.code === 200) {
        actions.buildCreate.updateState({
          runtimeList: res.data
          // runtimeList: [
          //   {
          //     "config": [
          //       "1.2",
          //       "1.3",
          //     ],
          //     "language": "JAVA"
          //   },
          //   {
          //     "config": [
          //       "6.2",
          //       "8.3",
          //       "12",
          //     ],
          //     "language": "node"
          //   }
          // ]
        })
      }
    },

    async stepButtonOp(data, getState) {
      let {type} = data
      let {current, steps} = getState().buildCreate
      let newCurrent = type === 'next' ? (current + 1) : (current - 1)
      let stepValidator = Object.keys(steps[newCurrent].fields).every(item => steps[newCurrent].fields[item].value !== undefined && steps[newCurrent].fields[item].value !== '')

      if (newCurrent === 1 && type === 'next') {
        actions.buildCreate.getGitlabGroupsProjects()
      }
      actions.buildCreate.updateCurrent({
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
        actions.buildCreate.updateState({
          projectBranches: res.body
        })
      }
    },

    async buildCreate(data = {}, getState) {
      let {steps, projectList} = getState().buildCreate
      let params = {
        // buildDirectory: "/",
        // buildLanguage: "JAVA",
        // buildName: "rrr",
        // codeBranch: "master",
        // codeRepository: 7, // string
        // exposePort: "8000", //number
        // imageRepository: "cloudzone",
        // imageVersion: "v1",
        // languageVersion: "1.2",
        // projectId: 68,
        // repositoryType: "git",

        // projectName: '',
        // imageName: '',
        // fromImage: ''
      }
      steps.forEach(item => {
        Object.keys(item.fields).forEach(field => {
          let value = item.fields[field].value
          if (value) params[field] = value
        })
      })

      params['projectName'] = projectList.filter(item => item.id === params.projectId)[0].name
      const res = await request(`${api.buildCreate}`, {
        method: 'POST',
        body: params
      });
      if (res.code === 200) {
        message.success('创建成功')
        actions.routing.push('/build/constructlist')
      }
    },
  }
};

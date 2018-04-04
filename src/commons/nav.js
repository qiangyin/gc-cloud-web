import asyncComponent from "../utils/AsyncComponent";

const UserLayout = asyncComponent(() => import("../layouts/UserLayout"));
const DashboardLayout = asyncComponent(() => import("../layouts/DashboardLayout"));
import api from "../commons/api";

const Login = asyncComponent(() => import("../routes/User/Login"));


// 項目管理
const AppMgmt = asyncComponent(() => import("../routes/AppMgmt"));

// 服务
const ServeMgmt = asyncComponent(()=>import("../routes/ServeMgmt"));
const ServeDetail = asyncComponent(()=>import("../routes/ServeMgmt/detail.jsx"));
const ServeCreate = asyncComponent(() => import("../routes/ServeMgmt/create"));

// 构建
const Construct = asyncComponent(()=>import("../routes/Construct"));
const ConstructDetail = asyncComponent(()=>import("../routes/Construct/detail.jsx"));
const BuildCreate = asyncComponent(() => import("../routes/Construct/create"));
const ConstructHistory = asyncComponent(() => import("../routes/Construct/history"));

const data = [{
  component: DashboardLayout,
  layout: 'DashboardLayout',
  name: 'DashboardLayout',
  path: '',
  children: [{
    name: '项目管理',
    icon: 'appstore-o',
    path: 'appmgmt',
    component: AppMgmt,
    children: []
  }, {
    name: '构建',
    icon: 'hdd',
    path: 'build',
    children: [{
      name: '构建列表',
      path: 'constructlist',
      icon: 'bars',
      component: Construct,
      children: [],
    }, {
      name: '',
      path: 'constructdetail/:projectId',
      icon: 'star-o',
      component: ConstructDetail,
      children: [],
    }, {
      name: '构建历史',
      path: 'constructhistory',
      icon: 'appstore',
      component: ConstructHistory,
      children: [],
    }, {
      name: '',
      icon: 'appstore-o',
      path: 'create',
      component: BuildCreate,
      children: []
    }]
  }, {
    name: '服务',
    icon: 'cloud-o',
    path: 'serve',
    children: [{
      name: '服务列表',
      path: 'servelist',
      icon: 'bars',
      component: ServeMgmt,
      children: [],
    }, {
      name: '',
      path: 'servedetail/:serviceName',
      icon: 'profile',
      component: ServeDetail,
      children: [],
    }, {
      name: '',
      icon: 'appstore-o',
      path: 'create',
      component: ServeCreate,
      children: []
    }]
  }
  ],
}, {
  component: UserLayout,
  layout: 'UserLayout',
  children: [{
    name: '帐户',
    icon: 'user',
    path: 'user',
    children: [{
      name: '登录',
      path: 'login',
      component: Login
    }]
  }]
}];

export function getNavData() {
  return data;
}

export default data;

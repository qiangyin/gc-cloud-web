//  const host = '10.122.251.106'
//  const baseUrl = `http://${host}:8080`;
const host = '10.112.101.98'
const basePath = "api/v1"

const baseUrl = `http://${host}:9999`;

// mock
// const baseUrl = `http://127.0.0.1:7300/mock/5a17e8c4636a2d479f40aff4`;
const mockUrl = `http://10.112.101.90:7300/mock/5aaf4c722ac0d03a364603d5`;

const api = {
  loginApi: `${baseUrl}/59c93b516816a01f1ef09b24/login`,
  logoutApi: `${baseUrl}/59c93b516816a01f1ef09b24/logout`,
  currentUser: `${baseUrl}/59c93b516816a01f1ef09b24/currentUser`,

  // user   
  login: `${baseUrl}/login`,
  logout: `${baseUrl}/logout`,
  getUserInfo: `${baseUrl}/${basePath}/userInfo`,
  console: `http://${host}:10042`,

  //
  projectList: `${baseUrl}/${basePath}/project`,
  gitlabGroups: `${baseUrl}/${basePath}/gitlab/groups`,
  gitlabProjects: `${baseUrl}/${basePath}/gitlab/projects`,
  projects: `${baseUrl}/${basePath}/gitlab/projects`,
  runtimeList: `${baseUrl}/${basePath}/runtime/list`,
  getHarborProjects: `${baseUrl}/${basePath}/harbor/projects`,
  getHaborRepositories: `${baseUrl}/${basePath}/harbor/repositories`,
  getHaborTags: `${baseUrl}/${basePath}/harbor/tags`,
  buildCreate: `${baseUrl}/${basePath}/build/create`,

  // 項目管理
  project: `${baseUrl}/${basePath}/project`, 

  // 服务
  serve: `${baseUrl}/${basePath}/k8s/`,
  serveCreate: `${baseUrl}/${basePath}/k8s/service/create`,
  serveList: `${baseUrl}/${basePath}/k8s/services`,
  serveStart: `${baseUrl}/${basePath}/k8s/`,
  serviceConfigList: `${baseUrl}/${basePath}/k8s/serviceConfig/list`,

  // 构建
  construct: `${baseUrl}/${basePath}/build/`,
  historyList: `${baseUrl}/${basePath}/build/history`,

};

export default api;

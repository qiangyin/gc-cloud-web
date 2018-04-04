import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { actions, connect, Route, Redirect, Switch, Link } from 'mirrorx';
import { Layout, Menu, Icon, Avatar, Dropdown, Tag, message, Spin } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import DocumentTitle from 'react-document-title';
import screenfull from 'screenfull';
import asyncComponent from "../utils/AsyncComponent";
import GlobalFooter from '../components/GlobalFooter';
import { getNavData } from '../commons/nav';
import { getRouteData } from '../utils';
import styles from './DashboardLayout.scss';
import img_react from '../assets/logo.png';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const copyright = <div>Copyright <Icon type="copyright" /> 2017 成都基础平台架构</div>;
const topTitle = 'React With Mirror';
const subTitle = '@By Antd';
const links = [];
// {
//   title: '首页',
//   href: '',
// }, {
//   title: '文档',
//   href: '',
// }, {
//   title: 'Github',
//   href: '',
// }

class DashboardLayout extends PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object
  }

  constructor(props) {
    super(props);
    // 把一级 Layout 的 children 作为菜单项
    this.menus = getNavData().filter((item) => item.name === 'DashboardLayout').reduce((arr, current) => arr.concat(current.children), []);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }

  componentDidMount() {
    actions.user.getCurrentUserInfo();
  }

  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      actions.login.logout();
    }
  }

  getChildContext() {
    const { location } = this.props;
    const routeData = getRouteData('DashboardLayout');
    const menuData = getNavData().reduce((arr, current) => arr.concat(current.children), []);
    const breadcrumbNameMap = {};
    routeData.concat(menuData).forEach((item) => {
      breadcrumbNameMap[item.path] = item.name;
    });
    return { location, breadcrumbNameMap };
  }

  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
    currentMenuSelectedKeys.splice(-1, 1);
    if (currentMenuSelectedKeys.length === 0) {
      return ['dashboard'];
    }
    return currentMenuSelectedKeys;
  }

  getCurrentMenuSelectedKeys(props) {
    const { location: { pathname } } = props || this.props;
    const keys = pathname.split('/').slice(1);
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key];
    }
    return keys;
  }

  getNavMenuItems(menusData, parentPath = '') {
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      if (!item.name) {
        return null;
      }
      let itemPath;
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (item.children && item.children.some(child => child.name)) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </span>
              ) : item.name
            }
            key={item.key || item.path}
          >
            {this.getNavMenuItems(item.children, itemPath)}
          </SubMenu>
        );
      }
      const icon = item.icon && <Icon type={item.icon} />;
      return (
        <Menu.Item key={item.key || item.path}>
          {
            /^https?:\/\//.test(itemPath) ? (
              <a href={itemPath} target={item.target}>
                {icon}<span>{item.name}</span>
              </a>
            ) : (
                <Link to={itemPath} target={item.target}>
                  {icon}<span>{item.name}</span>
                </Link>
              )
          }
        </Menu.Item>
      );
    });
  }


  // 侧边栏伸缩
  onCollapse = (collapsed) => {
    console.log(collapsed);
    actions.dashboard.changeLayoutCollapsed({ payload: collapsed });
  }

  onToggle = () => {
    const { collapsed } = this.props.dashboard;
    console.log(collapsed);
    actions.dashboard.changeLayoutCollapsed({ payload: !collapsed });
    this.resizeTimeout = setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, false);
      window.dispatchEvent(event);
    }, 600);
  }

  rootSubmenuKeys = ['dashboard'];

  handleOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }

  // 获取页面title
  getPageTitle() {
    const { location } = this.props;
    const { pathname } = location;
    let title = 'CloudAdmin';
    getRouteData('DashboardLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - CloudAdmin`;
      }
    });
    return title;
  }

  screenFull = () => {
    if (screenfull.enabled) {
      screenfull.request();
    }
  };

  render() {
    const { collapsed, fetchingNotices } = this.props.dashboard;
    const { currentUser, currentUserInfo } = this.props.user;

    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : {
      openKeys: this.state.openKeys,
    };

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );

    const layout = (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onCollapse={this.onCollapse}
          width={224}
          className={styles.sider}
        >
          <div className={styles.logo}>
            <Link to="/">
              <img src={img_react} alt="logo" />
              <h1>GC-Cloud</h1>
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            {...menuProps}
            onOpenChange={this.handleOpenChange}
            selectedKeys={this.getCurrentMenuSelectedKeys()}
            style={{ margin: '8px 0', width: '100%' }}
          >
            {this.getNavMenuItems(this.menus)}
          </Menu>
        </Sider>
        <Layout>
          <Header className={styles.header}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.onToggle}
            />
            <div className={styles.right}>
              <span className={styles.screenConetent}><Icon type="arrows-alt" onClick={this.screenFull} className={styles.screenFull} /></span>
              {currentUserInfo ? (
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                    {currentUserInfo.realName}
                  </span>
                </Dropdown>
              ) : <Spin size="small" style={{ marginLeft: 8 }} />}
            </div>
          </Header>
          <Content style={{ margin: '20px 20px 0', height: '100%' }}>
            <Switch>
              {
                getRouteData('DashboardLayout').map(item =>
                  (
                    <Route
                      exact={item.exact}
                      key={item.path}
                      path={item.path}
                      component={item.component}
                    />
                  )
                )
              }
              <Redirect to="/appmgmt" />
            </Switch>
            <GlobalFooter className={styles.footer} links={links} copyright={copyright} />
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div>
          {layout}
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(state => {
  return {
    dashboard: state.dashboard,
    user: state.user
  };
})(DashboardLayout);

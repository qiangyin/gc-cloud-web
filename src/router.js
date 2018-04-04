import * as React from 'react';
import { Router, Route, Switch, Redirect } from 'mirrorx';
import { LocaleProvider } from 'antd';
// import zhCN from 'antd/lib/locale-provider/zh_CN';
// import enUS from 'antd/lib/locale-provider/en_US';
import asyncComponent from "./utils/AsyncComponent";

const UserLayout = asyncComponent(() => import("./layouts/UserLayout"));
const DashboardLayout = asyncComponent(() => import("./layouts/DashboardLayout"));

export default () => (
  <LocaleProvider>
    <Router>
      <Switch>
        <Route path="/user" component={UserLayout} />
        <Route path="/" component={DashboardLayout} />
        <Redirect to="/" />
      </Switch>
    </Router>
  </LocaleProvider>
);

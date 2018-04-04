import React, { PureComponent } from 'react';
import { Link, Route } from 'mirrorx';
import { Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import GlobalFooter from '../components/GlobalFooter';
import { getRouteData } from '../utils';
import styles from './UserLayout.scss';
import img_react from '../assets/logo.svg';

const links = [{
  title: '',
  href: '',
}, {
  title: '',
  href: '',
}, {
  title: '',
  href: '',
}];

const copyright = <div>Copyright <Icon type="copyright" /> 2017 成都基础平台架构</div>;

class UserLayout extends PureComponent {
  getPageTitle() {
    const { location } = this.props;
    const { pathname } = location;
    let title = 'CloudAdmin';
    getRouteData('UserLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - CloudAdmin`;
      }
    });
    return title;
  }

  render() {
    return (
      <DocumentTitle title={this.getPageTitle()} >
        <div className={styles.container}>
          {
            getRouteData('UserLayout').map(item =>
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
          <GlobalFooter className={styles.footer} links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    )
  }
}
export default UserLayout;
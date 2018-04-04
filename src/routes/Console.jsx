import React, {PureComponent, Component} from 'react'
import {actions, connect} from 'mirrorx';
import Iframe from 'react-iframe'
import {Modal, Input, Row, Col, message} from 'antd'

import api from '../commons/api';


class Console extends Component {
  constructor(props) {
    super(props);
    this.state ={
      isAuth: false,
      visible: true,
      pwd: ''
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    actions.console.unmount()
  }

  render() {
    const {visible, pwd} = this.state
    const {isAuth} = this.props.states
    console.log(this.props.states)
    return (
      <div>
        {
          isAuth ?
            <Iframe
              url={api.console}
              width="100%"
              height="600px"
              id="myId"
              className="myClassname"
              display="initial"
              position="relative"
              allowFullScreen/> :
            <Modal
              title="密码确认"
              visible={visible}
              closable={false}
              width={300}
              onCancel={() => {
                this.setState({
                  visible: false
                })
              }}
              onOk={() => {
                if(!pwd) {
                  message.error('密码不能为空')
                } else {
                  actions.console.loginRequest(pwd);
                }
              }}
            >
              <Row align='middle' justify='center' type='flex'>
                <Col span={6}>请输入密码</Col>
                <Col span={16}><Input type='password' defaultValue={pwd} onBlur={(v) => {
                  this.setState({pwd: v.target.value})
                }} /></Col>
              </Row>
            </Modal>
        }
      </div>
    )
  }
}

export default connect(state => {
  return {
    states: state.console
  };
})(Console);

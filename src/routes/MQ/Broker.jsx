import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Col, Form, Select, Table, Card, Icon, Input, Button, Modal } from 'antd'
import styles from './Broker.scss'

const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
};

const BrokerUpdateForm = Form.create()(
  class UpdateForm extends PureComponent {
    constructor(props) {
      super(props);
    }

    onUpdateSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          actions.mqBroker.updateInfo(values);
        }
      });
    }

    render() {
      const { getFieldDecorator } = this.props.form;

      return (
        <Form onSubmit={this.onUpdateSubmit}>
          <FormItem
            hasFeedback
            {...formItemLayout}
            label="brokerAddr"
          >
            {getFieldDecorator('brokerAddr', {
              rules: [{ required: true, message: 'Please input your brokerAddr!' }],
            })(
              <Input />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="key"
          >
            {getFieldDecorator('key', {
              rules: [{ required: true, message: 'Please input your key!' }],
            })(
              <Input />
              )}
          </FormItem>
          <FormItem
            hasFeedback
            {...formItemLayout}
            label="Value"
          >
            {getFieldDecorator('value', {
              rules: [{ required: true, message: 'Please input your Value!' }],
            })(
              <Input />
              )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 7, offset: 8 }}
          >
            <Button type="primary" htmlType="submit" icon='check' loading={this.props.states.submitting}>
              确定
                </Button>
          </FormItem>
        </Form>
      )
    }
  }
)

class Broker extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    actions.mqBroker.unmount();
  }

  onSearch = () => {
    actions.mqBroker.getData();
  }

  render() {
    const { states } = this.props;
    const { data } = states;
    const dataList = [];
    for (let key in data) {
      dataList.push(
        <li key={key} >
          <Col span={24} style={{ padding: 4 }}>
            <Col span={10}>
              {key}
            </Col>
            <Col span={14} >
              {data[key]}
            </Col>
          </Col>
        </li>
      )
    }

    return (
      <div className={styles.content}>
        <Col span={24} key={'a'} >
          <Card loading={false} title={'UpdateBrokerConfig'} style={{ marginBottom: 20 }}>
            <BrokerUpdateForm states={states} />   
          </Card>
        </Col>

        <Col span={24} key={'b'}>
          <Card title={'BrokerStats'} style={{ marginBottom: 20 }}>
            <Form >
              <FormItem label='BrokerAddr' {...formItemLayout}>
                <Input
                  onChange={(e) => { actions.mqBroker.setQueryParams({ brokerAddr: e.target.value }) }}
                />
              </FormItem>
              <FormItem
                wrapperCol={{ span: 7, offset: 8 }}
              >
                <Button type='primary' icon='search' onClick={this.onSearch}>查询</Button>
              </FormItem>
            </Form>
          </Card>
        </Col>
        <Modal
          title="详情"
          width={700}
          closable={false}
          style={{ top: 20 }}
          visible={states.modalIsShow}
          onOk={() => actions.mqBroker.showModal(false)}
          onCancel={() => actions.mqBroker.showModal(false)}
        >
          <ul>
            {dataList}
            <br style={{clear:'both'}}/>
          </ul>
        </Modal>
      </div>
    )
  }
}

export default connect(state => {
  return {
    states: state.mqBroker,
  };
})(Broker);
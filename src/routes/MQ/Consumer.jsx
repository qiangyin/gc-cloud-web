import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Col, Form, Select, Table, Card, Icon, Input, Button, Modal, InputNumber } from 'antd'
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

const DeleteForm = Form.create()(
  class DelForm extends PureComponent {
    constructor(props) {
      super(props);
    }

    onDelSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          actions.mqConsumer.deleteInfo(values);
        }
      });
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.onDelSubmit}>
          <FormItem
            hasFeedback
            {...formItemLayout}
            label="groupName"
          >
            {getFieldDecorator('groupName', {
              rules: [{ required: true, message: 'Please input your groupName!' }],
            })(
              <Input />
              )}
          </FormItem>
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
            wrapperCol={{ span: 7, offset: 8 }}
          >
            <Button type="primary" htmlType="submit" icon='check'>确定</Button>
          </FormItem>
        </Form>
      )
    }
  }
)

const UpdateForm = Form.create()(
  class updForm extends PureComponent {
    constructor(props) {
      super(props);
    }

    onUpdateSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          actions.mqConsumer.updateInfo(values);
        }
      });
    }

    render() {
      const { getFieldDecorator } = this.props.form;

      return (
        <Form onSubmit={this.onUpdateSubmit}>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="groupName"
          >
            {getFieldDecorator('groupName', {
              rules: [{ required: true, message: 'Please input your groupName!' }],
            })(
              <Input />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="brokerAddr"
          >
            {getFieldDecorator('brokerAddr', {
              rules: [{ required: true, message: 'Please input your brokerAddr!' }],
            })(
              <Input />
              )}
          </FormItem>
          <FormItem
            hasFeedback
            {...formItemLayout}
            label="consumeBroadcastEnable"
          >
            {
              getFieldDecorator('consumeBroadcastEnable', {
                rules: [{ type: 'boolean', message: 'Please input your groupName!' }],
              })(
                <Select>
                  <Option value={false}>false</Option>
                  <Option value={true}>true</Option>
                </Select>
                )
            }
          </FormItem>
          <FormItem
            hasFeedback
            {...formItemLayout}
            label="consumeEnable"
          >
            {
              getFieldDecorator('consumeEnable', {
                rules: [{ type: 'boolean' }],
              })(
                <Select>
                  <Option value={false}>false</Option>
                  <Option value={true}>true</Option>
                </Select>
                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="consumeFromMinEnable"
          >
            {
              getFieldDecorator('consumeFromMinEnable', {
                rules: [{ type: 'boolean' }],
              })(
                <Select>
                  <Option value={false} >false</Option>
                  <Option value={true}>true</Option>
                </Select>
                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="whichBrokerWhenConsumeSlowly"
          >
            {getFieldDecorator('whichBrokerWhenConsumeSlowly', {
              rules: [{ type: 'number', message: 'Please input type of Number' }]
            })(
              <InputNumber style={{ width: '100%' }} />
              )}
          </FormItem>
          <FormItem
            hasFeedback
            {...formItemLayout}
            label="retryMaxTimes"
          >
            {getFieldDecorator('retryMaxTimes', {
              rules: [{ type: 'number', message: 'Please input type of Number' }]
            })(
              <InputNumber style={{ width: '100%' }} />
              )}
          </FormItem>
          <FormItem
            hasFeedback
            {...formItemLayout}
            label="retryQueueNums"
          >
            {getFieldDecorator('retryQueueNums', {
              rules: [{ type: 'number', message: 'Please input type of Number' }]
            })(
              <InputNumber style={{ width: '100%' }} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="brokerId"
          >
            {getFieldDecorator('brokerId')(
              <InputNumber style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem wrapperCol={{ span: 7, offset: 8 }}>
            <Button type='primary' icon='check' htmlType="submit" loading={this.props.states.submitting}>确定</Button>
          </FormItem>
        </Form>
      )
    }
  }
)

class Consumer extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    actions.mqConsumer.unmount();
  }

  render() {
    const { states } = this.props;

    return (
      <div className={styles.content}>
        <Col span={24} key={'a'} >
          <Card title={'DeleteSubGroup'} style={{ marginBottom: 20 }}>
            <DeleteForm states={states} />
          </Card>
        </Col>

        <Col span={24} key={'b'}>
          <Card title={'UpdateSubGroup'} style={{ marginBottom: 20 }}>
            <UpdateForm states={states} />
          </Card>
        </Col>

      </div>
    )
  }
}

export default connect(state => {
  return {
    states: state.mqConsumer,
  };
})(Consumer);
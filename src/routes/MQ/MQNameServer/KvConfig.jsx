import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Col, Form, Select, Table, Card, Icon, Input, Button } from 'antd'
import styles from './ClusterMngmt.scss'

const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
};

const formItemLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
};

const KvUpdateForm = Form.create()(
  class UpdateForm extends PureComponent {
    constructor(props) {
      super(props);
    }

    onUpdateSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          actions.mqKvConfig.updateInfo(values);
        }
      });
    }

    render() {
      const { getFieldDecorator } = this.props.form;

      return (
        <Form onSubmit={this.onUpdateSubmit}>
          <FormItem
            hasFeedback
            {...formItemLayout1}
            label="namespace"
          >
            {getFieldDecorator('namespace', {
              rules: [{ required: true, message: 'Please input your namespace!' }],
            })(
              <Input />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout1}
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
            {...formItemLayout1}
            label="Value"
          >
            {getFieldDecorator('value', {
              rules: [{ required: true, message: 'Please input your Value!' }],
            })(
              <Input />
              )}
          </FormItem>
          <FormItem
            hasFeedback
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

const KvDeleteForm = Form.create()(
  class DeleteForm extends PureComponent {
    constructor(props) {
      super(props);
    }

    onDeleteSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          actions.mqKvConfig.deleteInfo(values);
        }
      });
    }

    render() {
      const { getFieldDecorator } = this.props.form;

      return (
        <Form onSubmit={this.onDeleteSubmit}>
          <FormItem
            {...formItemLayout1}
            hasFeedback
            label="namespace"
          >
            {getFieldDecorator('namespace', {
              rules: [{ required: true, message: 'Please input your namespace!' }],
            })(
              <Input />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout1}
            hasFeedback
            label="key"
          >
            {getFieldDecorator('key', {
              rules: [{ required: true, message: 'Please input your key!' }],
            })(
              <Input />
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


class KvConfig extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // 获取地区
    actions.mqKvConfig.getZone();
  }

  componentWillUnmount() {
    actions.mqKvConfig.unmount();
  }

  onZoneChange = (value) => {
    console.log('onZoneChange-->', value);
    actions.mqKvConfig.setEnvParams({ zoneId: value });
    actions.mqKvConfig.setQueryParams({ zoneId: value });
    actions.mqKvConfig.getEnvironment();
  }

  onEnvChange = (value) => {
    console.log('onEnvChange-->', value);
    actions.mqKvConfig.setQueryParams({ environmentId: value });
    actions.mqKvConfig.setClusterParams({ environmentId: value });
    actions.mqKvConfig.getCluster();
  }

  onClusterChange = (value) => {
    console.log('onClusterChange-->', value);
    actions.mqKvConfig.setQueryParams({ clusterName: value });
    actions.mqKvConfig.getAddressData();
  }

  render() {
    const { states } = this.props;
    const { addressData, zoneData, envData, clusterData } = states;

    const zoneList = zoneData.map((item, i) => {
      return <Option value={item.zoneId} key={i}>{item.zoneName}</Option>
    });

    const environmentList = envData.map((item, i) => {
      return <Option value={item.environmentId} key={i}>{item.environmentName}</Option>
    });

    const clusterList = clusterData.map((item, i) => {
      return <Option value={item} key={i}>{item}</Option>
    })

    return (
      <div className={styles.content}>
        <Col span={24} className={styles.headForm} key={'a'}>
          <Form layout='inline' >
            <FormItem label='地区'  {...formItemLayout}>
              <Select
                value={states.envParams.zoneId}
                style={{ width: 150 }}
                onChange={this.onZoneChange}
              >
                {zoneList}
              </Select>
            </FormItem>
            <FormItem label='环境'  {...formItemLayout}>
              <Select
                value={states.queryParams.environmentId}
                style={{ width: 150 }}
                onChange={this.onEnvChange}
              >
                {environmentList}
              </Select>
            </FormItem>
            <FormItem label='Cluster'>
              <Select
                style={{ width: 300 }}
                value={states.queryParams.clusterName}
                onChange={this.onClusterChange}
              >
                {clusterList}
              </Select>
            </FormItem>
          </Form>
        </Col>

        <Col span={24} key={'b'} >
          <Card loading={false} title={'UpdateKvConfig'} style={{ marginBottom: 20 }}>
            <KvUpdateForm states={states} />
          </Card>
        </Col>

        <Col span={24} key={'c'}>
          <Card title={'DeleteKvConfig'} style={{ marginBottom: 20 }}>
            <KvDeleteForm states={states} />
          </Card>
        </Col>
      </div>
    )
  }
}

export default connect(state => {
  return {
    states: state.mqKvConfig,
  };
})(KvConfig);

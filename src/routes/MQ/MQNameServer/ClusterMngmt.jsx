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
    sm: { span: 8 },
  },
};

const formItemLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class ClusterMngmt extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // 获取地区
    actions.mqClusterMgmt.getZone();
  }

  componentWillUnmount() {
    actions.mqClusterMgmt.unmount();
  }

  onZoneChange = (value) => {
    console.log('onZoneChange-->', value);
    actions.mqClusterMgmt.setEnvParams({ zoneId: value });
    actions.mqClusterMgmt.setQueryParams({ zoneId: value });
    actions.mqClusterMgmt.getEnvironment();
  }

  onEnvChange = (value) => {
    console.log('onEnvChange-->', value);
    actions.mqClusterMgmt.setQueryParams({ environmentId: value });
    actions.mqClusterMgmt.setClusterParams({ environmentId: value });
    actions.mqClusterMgmt.getCluster();
  }

  onClusterChange = (value) => {
    console.log('onClusterChange-->', value);
    actions.mqClusterMgmt.setQueryParams({ clusterName: value });
    actions.mqClusterMgmt.getAddressData();
  }

  onSubmit = () => {
    actions.mqClusterMgmt.getTableData();
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

    const columns = [
      {
        title: 'namesrvAddr',
        dataIndex: 'Namesrv',
      }, {
        title: 'brokerName',
        dataIndex: 'BrokerName',
      }, {
        title: 'wipeTopicCount',
        dataIndex: 'WipeTopicCount',
      }
    ]

    const addressList = addressData.map((item, i) => {
      return (
        <Col span={6} key={i}>
          <FormItem key={i} {...formItemLayout1} label={<Icon type="database" style={{ fontSize: 28, color: '#08c', lineHeight: 1.2 }} />} colon={false}>
            <Input disabled value={item} />
          </FormItem>
        </Col>
      )
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
          <Card loading={false} title={'集群地址'} style={{ marginBottom: 20 }}>
            <Form >
              {addressList}
            </Form>
          </Card>
        </Col>

        <Col span={24} key={'c'}>
          <Card title={'WipeWritePerm'} style={{ marginBottom: 20 }}>
            <Form layout='inline' style={{ marginBottom: 20 }}>
              <FormItem label='BrokerName'>
                <Input
                  placeholder="请输入BrokerName"
                  style={{ width: 250 }}
                  onChange={(e) => { actions.mqClusterMgmt.setQueryBrokerParams({ brokerName: e.target.value }) }} />
              </FormItem>
              <FormItem>
                <Button type='primary' icon='exclamation-circle-o' onClick={this.onSubmit}>提交</Button>
              </FormItem>
            </Form>
            <Table
              bordered
              columns={columns}
              dataSource={states.tableData}
              loading={states.loading}
              pagination={false}
            />
          </Card>
        </Col>
      </div>
    )
  }
}

export default connect(state => {
  return {
    states: state.mqClusterMgmt,
  };
})(ClusterMngmt);
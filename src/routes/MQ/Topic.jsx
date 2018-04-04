import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Col, Form, Select, Table, Card, Button, Modal } from 'antd'
import styles from './Cluster.scss'

const Option = Select.Option;
const FormItem = Form.Item;

class Topic extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // 获取地区
    actions.mqTopic.getZone();
  }

  componentWillUnmount() {
    actions.mqTopic.unmount();
  }

  onZoneChange = (value) => {
    console.log('onZoneChange-->', value);
    actions.mqTopic.setEnvParams({ zoneId: value });
    actions.mqTopic.setClusterParams({ zoneId: value });
    actions.mqTopic.setQueryParams({ zoneId: value });
    actions.mqTopic.getEnvironment();
  }

  onEnvChange = (value) => {
    console.log('onEnvChange-->', value);
    actions.mqTopic.setQueryParams({ environmentId: value });
    actions.mqTopic.setClusterParams({ environmentId: value });
    actions.mqTopic.getCluster();
  }

  onClusterChange = (value) => {
    console.log('onClusterChange-->', value);
    actions.mqTopic.setQueryParams({ clusterName: value });
    actions.mqTopic.resetPager();
    actions.mqTopic.getTableData1();
    actions.mqTopic.getTableData2();
    actions.mqTopic.getTableData3();
  }

  handleTableChange1 = (pagination, filters, sorter) => {
    const pager = {
      ...this.props.states.pagination1,
      current: pagination.current,
      pageSize: pagination.pageSize
    };
    actions.mqTopic.setPageParams1({ pagination: pager });
    actions.mqTopic.getTableData1();
  }

  handleTableChange2 = (pagination, filters, sorter) => {
    const pager = {
      ...this.props.states.pagination2,
      current: pagination.current,
      pageSize: pagination.pageSize
    };
    actions.mqTopic.setPageParams2({ pagination: pager });
    actions.mqTopic.getTableData2();
  }

  handleTableChange3 = (pagination, filters, sorter) => {
    const pager = {
      ...this.props.states.pagination3,
      current: pagination.current,
      pageSize: pagination.pageSize
    };
    actions.mqTopic.setPageParams3({ pagination: pager });
    actions.mqTopic.getTableData3();
  }

  onSearchStoreInfo = (topicName) => {
    actions.mqTopic.getTableData4({ topic: topicName });
    actions.mqTopic.showModal(true);
  }

  onSearchGroup = (topicName) => {
    actions.mqTopic.getTableData5({ topic: topicName });
    actions.mqTopic.showModal2(true);
  }

  render() {
    const { states } = this.props;
    const { zoneData, envData, clusterData, tableData, retryTopicList, topicList, deadTopicList } = states;

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
        title: '序号',
        key: 'index',
        render: (value, data, index) => {
          return index + 1;
        }
      }, {
        title: 'Topic',
        key: 'Topic',
        dataIndex: 'topicName'
      }, {
        title: '操作',
        key: 'handle',
        dataIndex: 'handle',
        render: (value, data, index) => {
          return (
            <div>
              <Button type='primary' onClick={() => this.onSearchStoreInfo(encodeURIComponent(data.topicName))}>存储状态</Button>
              <Button type='primary' onClick={() => this.onSearchGroup(encodeURIComponent(data.topicName))}>消费组</Button>
            </div>
          )
        }
      }
    ]

    const modalColumns = [
      {
        title: 'TopicName',
        dataIndex: 'topic',
        key: 'topic'
      }, {
        title: 'BrokerName',
        dataIndex: 'brokerName',
        key: 'brokerName'
      }, {
        title: 'QueueId',
        dataIndex: 'queueId',
        key: 'queueId'
      }, {
        title: 'Max Offset',
        dataIndex: 'maxOffset',
        key: 'maxOffset'
      }, {
        title: 'Min Offset',
        dataIndex: 'minOffset',
        key: 'minOffset'
      }, {
        title: 'Last Update',
        dataIndex: 'lastUpdateTimestamp',
        key: 'lastUpdateTimestamp'
      }
    ];

    const modalColumns2 = [
      {
        title: 'ConsumerGroupID',
        dataIndex: 'consumerGroupId',
        key: 'consumerGroupId'
      }, {
        title: 'Topic',
        dataIndex: 'topic',
        key: 'topic'
      }
    ];

    return (
      <div className={styles.content}>
        <Col span={24} className={styles.headForm} key='a'>
          <Form layout='inline' >
            <FormItem label='地区'>
              <Select
                value={states.envParams.zoneId}
                style={{ width: 150 }}
                onChange={this.onZoneChange}
              >
                {zoneList}
              </Select>
            </FormItem>
            <FormItem label='环境'>
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
        <Col span={24} key='b'>
          <Card title={'普通队列'} style={{ marginBottom: 20 }}>
            <Table
              bordered
              columns={columns}
              dataSource={states.tableData1}
              loading={states.loading1}
              onChange={this.handleTableChange1}
              pagination={states.pagination1}
            />
          </Card>
          <Card title={'重试队列'} style={{ marginBottom: 20 }}>
            <Table
              bordered
              columns={columns}
              dataSource={states.tableData2}
              loading={states.loading2}
              onChange={this.handleTableChange2}
              pagination={states.pagination2}
            />
          </Card>
          <Card title={'死信队列'} style={{ marginBottom: 20 }}>
            <Table
              bordered
              columns={columns}
              dataSource={states.tableData3}
              loading={states.loading3}
              onChange={this.handleTableChange3}
              pagination={states.pagination3}
            />
          </Card>
        </Col>
        <Modal
          key='modal1'
          width={800}
          closable={false}
          visible={states.modalIsShow}
          onOk={() => actions.mqTopic.showModal(false)}
          onCancel={() => actions.mqTopic.showModal(false)}
        >
          <Table
            bordered
            columns={modalColumns}
            dataSource={states.tableData4}
            loading={false}
            pagination={false}
          />
        </Modal>
        <Modal
          key='modal2'
          width={700}
          closable={false}
          visible={states.modalIsShow2}
          onOk={() => actions.mqTopic.showModal2(false)}
          onCancel={() => actions.mqTopic.showModal2(false)}
        >
          <Table
            bordered
            columns={modalColumns2}
            dataSource={states.tableData5}
            loading={false}
            pagination={false}
          />
        </Modal>
      </div>
    )
  }
}

export default connect(state => {
  return {
    states: state.mqTopic,
  };
})(Topic);
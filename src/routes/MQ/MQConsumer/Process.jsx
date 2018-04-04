import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Col, Button, Icon, Form, Select, Input, Table, Modal } from 'antd'
import styles from './Process.scss'

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

class Process extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalData: [],
    };
  }

  componentDidMount() {
    // 获取地区
    actions.mqConsumerProcess.getZone();
  }

  componentWillUnmount() {
    actions.mqConsumerProcess.unmount();
  }

  onZoneChange = (value) => {
    console.log('onZoneChange-->', value);
    actions.mqConsumerProcess.setEnvParams({ zoneId: value });
    actions.mqConsumerProcess.setQueryParams({ zoneId: value });
    actions.mqConsumerProcess.getEnvironment();
  }

  onEnvChange = (value) => {
    console.log('onEnvChange-->', value);
    actions.mqConsumerProcess.setQueryParams({ environmentId: value });
  }

  onSubmit = () => {
    actions.mqConsumerProcess.resetPager();
    actions.mqConsumerProcess.getTableData();
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {
      ...this.props.states.pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    };
    actions.mqConsumerProcess.setPageParams({ pagination: pager });
    actions.mqConsumerProcess.getTableData();
  }

  // 订阅信息
  showInfoModal = params => {
    const modalData = [];
    if (params && params.subscribeTopicTable) {
      params.subscribeTopicTable.map((item, i) => {
        modalData.push(item)
      })
    }
    this.setState({ modalData })
    actions.mqConsumerProcess.showModal(true);
  }

  // 进度
  showProgress = (data, groups) => {
    console.log('showProgress-->', data)
    const clusterId = data.clusterId;
    let consumerGroupId = '';
    if (groups) {
      consumerGroupId = groups.consumerGroupId;
    }
    const topic = data.topic;
    const param = {
      clusterId,
      consumerGroupId,
      topic
    }
    actions.routing.push({ pathname: '/dashboard/consume/progress', query: param });
  }

  render() {
    const { states } = this.props;

    const zoneList = states.zoneData.map((item, i) => {
      return <Option value={item.zoneId} key={i}>{item.zoneName}</Option>
    });

    const environmentList = states.envData.map((item, i) => {
      return <Option value={item.environmentId} key={i}>{item.environmentName}</Option>
    });

    const columns = [
      {
        title: '序号',
        render: (value, data, index) => {
          return index + 1;
        }
      }, {
        title: 'Topic名称',
        dataIndex: 'topic',
        key: 'topic',
        width: '20%',
      }, {
        title: '消费者组信息',
        dataIndex: 'groups',
        key: 'groups1',
        width: '20%',
        render: (value, data, index) => {
          if (value === null)
            return '暂无信息';
          const content = value.map((item, i) => {
            return <div>
              <p>组ID: {item.consumerGroupId}</p>
              <p>堆积数: {item.diffTotal}</p>
              <p>消费TPS: {item.consumeTps}</p>
            </div>
          })
          return <div>
            {content}
          </div>
        }
      }, {
        title: '消费者地址',
        dataIndex: 'groups',
        key: 'groups2',
        render: (value, data, index) => {
          if (value == null)
            return '暂无地址'
          const content = value.map((item, i) => {
            return <p key={i} style={{ padding: '20px 0' }}>{item.clientAddr}</p>
          })
          return <div>
            {content}
          </div>
        }
      }, {
        title: '消费者实例名称',
        dataIndex: 'groups',
        key: 'groups3',
        width: '20%',
        render: (value, data, index) => {
          if (value == null)
            return '暂无消费进程'
          const content = value.map((item, i) => {
            return <p key={i} style={{ padding: '15px 0' }}>{item.clientId}</p>
          })
          return <div>
            {content}
          </div>
        }
      }, {
        title: '角色操作',
        dataIndex: 'groups',
        key: 'groups4',
        render: (value, data, index) => {
          if (value == null)
            return ''
          const content = value.map((item, i) => {
            return <div key={i} style={{ padding: '15px 0' }}>
              <Button type='primary' onClick={() => this.showInfoModal(data.groups[i])}>订阅信息</Button>
              <Button type='primary' onClick={() => this.showProgress(data, data.groups[i])}>进度</Button>
            </div>
          })
          return <div >
            {content}
          </div>
        }
      }
    ]

    const modalColumns = [
      {
        title: 'Tag',
        dataIndex: 'tags',
        key: 'tags'
      }, {
        title: 'Topic',
        dataIndex: 'topic',
        key: 'topic'
      }
    ];

    return (
      <div className={styles.content}>
        <Col span={24} className={styles.headForm}>
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
                value={states.tableParams.environmentId}
                style={{ width: 150 }}
                onChange={this.onEnvChange}
              >
                {environmentList}
              </Select>
            </FormItem>
            <FormItem label='名称'>
              <Input
                placeholder="请输入Topic名称"
                style={{ width: 250 }}
                onChange={(e) => { actions.mqConsumerProcess.setQueryParams({ topic: encodeURIComponent(e.target.value) }) }} />
            </FormItem>
            <FormItem>
              <Button type='primary' icon='search' onClick={this.onSubmit}>查询</Button>
            </FormItem>
          </Form>
        </Col>
        <Col span={24} className={styles.table}>
          <Table
            bordered
            columns={columns}
            // rowKey={record => record.registered}
            dataSource={states.tableData}
            loading={states.loading}
            onChange={this.handleTableChange}
            pagination={states.pagination}
          />
        </Col>
        <Modal
          width={700}
          closable={false}
          visible={states.modalIsShow}
          onOk={() => actions.mqConsumerProcess.showModal(false)}
          onCancel={() => actions.mqConsumerProcess.showModal(false)}
        >
          <Table
            bordered
            columns={modalColumns}
            dataSource={this.state.modalData}
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
    states: state.mqConsumerProcess,
  };
})(Process);
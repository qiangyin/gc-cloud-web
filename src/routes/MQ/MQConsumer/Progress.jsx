import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Col, Button, Icon, Form, Select, Input, Table } from 'antd'
import styles from './Process.scss'

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

class Progress extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isHideForm: true,
    };
  }

  componentDidMount() {
    const params = this.props.location.query || {};
    if (params.topic) {
      this.setState({ isHideForm: true })
      actions.mqConsumerProgress.setQueryParams({ consumerGroupId: params.consumerGroupId, clusterId: params.clusterId, topic: params.topic })
      actions.mqConsumerProgress.getTableData()
    } else {
      this.setState({ isHideForm: false })
      // 获取地区
      actions.mqConsumerProgress.getZone();
    }
  }

  componentWillUnmount() {
    actions.mqConsumerProgress.unmount();
  }

  onZoneChange = (value) => {
    console.log('onZoneChange-->', value);
    actions.mqConsumerProgress.setEnvParams({ zoneId: value });
    actions.mqConsumerProgress.setGroupParams({ zoneId: value });
    actions.mqConsumerProgress.setQueryParams({ zoneId: value });
    actions.mqConsumerProgress.getEnvironment();
  }

  onEnvChange = (value) => {
    console.log('onEnvChange-->', value);
    actions.mqConsumerProgress.setQueryParams({ environmentId: value });
    actions.mqConsumerProgress.setGroupParams({ environmentId: value });
    actions.mqConsumerProgress.getGroup();
  }

  onGroupChange = (value) => {
    console.log('onGroupChange-->', value);
    const params = JSON.parse(value);
    actions.mqConsumerProgress.setQueryParams({ consumerGroupId: params.consumerGroupId, clusterId: params.clusterId, topic: params.topic });
    actions.mqConsumerProgress.resetPager();
    actions.mqConsumerProgress.getTableData();
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {
      ...this.props.states.pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    };
    actions.mqConsumerProgress.setPageParams({ pagination: pager });
    actions.mqConsumerProgress.getTableData();
  }

  render() {
    const { states } = this.props;
    const { zoneData, envData, groupData } = states;

    const zoneList = zoneData.map((item, i) => {
      return <Option value={item.zoneId} key={i}>{item.zoneName}</Option>
    });

    const environmentList = envData.map((item, i) => {
      return <Option value={item.environmentId} key={i}>{item.environmentName}</Option>
    });

    const groupList = groupData.map((item, i) => {
      const gValue = { "consumerGroupId": item.consumerGroupId, "clusterId": item.clusterId, "topic": item.topic }
      return <Option value={JSON.stringify(gValue)} key={i}>{item.consumerGroupId}</Option>
    })

    let selectValue = '无';
    if (states.tableParams.consumerGroupId && states.tableParams.clusterId && states.tableParams.topic) {
      selectValue = JSON.stringify({ consumerGroupId: states.tableParams.consumerGroupId, clusterId: states.tableParams.clusterId, topic: states.tableParams.topic })
    }

    const columns = [{
      title: '序号',
      render: (value, data, index) => {
        return index + 1;
      }
    }, {
      title: 'Topic名称',
      dataIndex: 'topic',
    }, {
      title: 'consumerOffset',
      dataIndex: 'consumerOffset',
    }, {
      title: 'queueId',
      dataIndex: 'queueId',
    }, {
      title: 'brokerOffset',
      dataIndex: 'brokerOffset',
    }, {
      title: 'brokerName',
      dataIndex: 'brokerName',
    }, {
      title: 'diff',
      dataIndex: 'diff',
    }];

    return (
      <div className={styles.content}>

        {
          this.state.isHideForm
            ? null : <Col span={24} className={styles.headForm}>
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
                    value={states.groupParams.environmentId}
                    style={{ width: 150 }}
                    onChange={this.onEnvChange}
                  >
                    {environmentList}
                  </Select>
                </FormItem>
                <FormItem label='GroupID'>
                  <Select
                    style={{ width: 300 }}
                    value={selectValue}
                    onChange={this.onGroupChange}
                  >
                    {groupList}
                  </Select>
                </FormItem>
              </Form>
            </Col>
        }

        <Col span={24} className={styles.table}>
          <Table
            bordered
            columns={columns}
            // rowKey={record => record.registered}
            dataSource={states.tableData.data}
            loading={states.loading}
            onChange={this.handleTableChange}
            pagination={states.pagination}
            title={() => {
              return <span>在线消费TPS:{states.tableData.consumeTps} <span style={{ marginLeft: 25 }}>消息堆积总条数:{states.tableData.diffTotal}</span></span>
            }}
          />
        </Col>
      </div>
    )
  }
}

export default connect(state => {
  return {
    states: state.mqConsumerProgress,
  };
})(Progress);
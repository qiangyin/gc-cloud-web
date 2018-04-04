import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Col, Form, Select, Table, Card, Button, Input } from 'antd'
import styles from './MsgIndex.scss';

const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
};

class MsgIndex extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // 获取地区
    actions.mqMsgIndex.getZone();
  }

  componentWillUnmount() {
    actions.mqMsgIndex.unmount();
  }

  onZoneChange = (value) => {
    console.log('onZoneChange-->', value);
    actions.mqMsgIndex.setEnvParams({ zoneId: value });
    actions.mqMsgIndex.setClusterParams({ zoneId: value });
    actions.mqMsgIndex.setQueryParams({ zoneId: value });
    actions.mqMsgIndex.getEnvironment();
  }

  onEnvChange = (value) => {
    console.log('onEnvChange-->', value);
    actions.mqMsgIndex.setQueryParams({ environmentId: value });
    actions.mqMsgIndex.setClusterParams({ environmentId: value });
    actions.mqMsgIndex.getCluster();
  }

  onClusterChange = (value) => {
    console.log('onClusterChange-->', value);
    actions.mqMsgIndex.setQueryParams({ clusterName: value });
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {
      ...this.props.states.pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    };
    actions.mqMsgIndex.setPageParams({ pagination: pager });
    actions.mqMsgIndex.getTableData();
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        actions.mqMsgIndex.resetPager();
        actions.mqMsgIndex.getTableData();
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
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
        title: 'MessageID',
        dataIndex: 'msgId'
      }, {
        title: 'QID',
        dataIndex: 'queueId'
      }, {
        title: 'Offset',
        dataIndex: 'queueOffset'
      }
    ]

    const topicLists = tableData.map((item, i) => {
      return (
        <Card loading={states.loading} title={item.topicType} style={{ marginBottom: 20 }}>
          <Table
            bordered
            columns={columns}
            dataSource={item.content}
            loading={false}
            pagination={false}
          />
        </Card>
      )
    });

    return (
      <div className={styles.content}>
        <Col span={24} className={styles.headForm}>
          <Form layout='inline' >
            <Col span={24} style={{ marginBottom: 20 }}>
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
            </Col>

            <Col span={24} >
              <FormItem
                label="topic"
                hasFeedback
              >
                {getFieldDecorator('topic', {
                  rules: [{
                    required: true, message: '请输入topic名称!',
                  }],
                })(
                  <Input
                    style={{ width: 220 }}
                    onChange={(e) => actions.mqMsgIndex.setQueryParams({ topic: e.target.value })}
                  />
                  )}
              </FormItem>
              <FormItem
                label="msgKey"
                hasFeedback
              >
                {getFieldDecorator('msgKey', {
                  rules: [{
                    required: true, message: '请输入msgKey!',
                  }],
                })(
                  <Input
                    style={{ width: 220 }}
                    onChange={(e) => actions.mqMsgIndex.setQueryParams({ key: e.target.value })}
                  />
                  )}
              </FormItem>
              <FormItem>
                <Button type='primary' icon='search' htmlType="submit" onClick={this.onSubmit}>查询</Button>
              </FormItem>
            </Col>

          </Form>
        </Col>

        <Col span={24} className={styles.table}>
          <Table
            bordered
            columns={columns}
            dataSource={states.tableData}
            loading={states.loading}
            onChange={this.handleTableChange}
            pagination={states.pagination}
          />
        </Col>
      </div>
    )
  }
}

const msgIndexForm = Form.create()(MsgIndex);
export default connect(state => {
  return {
    states: state.mqMsgIndex,
  };
})(msgIndexForm);
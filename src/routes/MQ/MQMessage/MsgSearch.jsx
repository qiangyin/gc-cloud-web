import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Col, Button, Icon, Form, Select, Input, Table, Card } from 'antd'
import styles from './MsgSearch.scss'

const { TextArea, Search } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 13 },
};

const detailInfo = [{
  label: 'msgId',
  valueName: 'msgId',
}, {
  label: 'storeHost',
  valueName: 'storeHost'
}, {
  label: 'storeTimeStamp',
  valueName: 'storeTimestamp'
}, {
  label: 'storeSize',
  valueName: 'storeSize'
}, {
  label: 'bornTimeStamp',
  valueName: 'bornTimestamp'
}, {
  label: 'bornHost',
  valueName: 'bornHost'
}, {
  label: 'queueId',
  valueName: 'queueId'
}, {
  label: 'reconsumeTimes',
  valueName: 'reconsumeTimes'
}, {
  label: 'Queue Offset',
  valueName: 'queueOffset'
}, {
  label: 'System Flag',
  valueName: 'sysFlag'
}, {
  label: 'topic',
  valueName: 'topic'
}, {
  label: 'commitLogOffset',
  valueName: 'commitLogOffset'
}, {
  label: 'messagePath',
  valueName: 'messagePath',
  type: 'TextArea'
}];

class MsgSearch extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // 获取地区
    actions.mqMsgSearch.getZone();
  }

  componentWillUnmount() {
    actions.mqMsgSearch.unmount();
  }

  onZoneChange = (value) => {
    console.log('onZoneChange-->', value);
    actions.mqMsgSearch.setEnvParams({ zoneId: value });
    actions.mqMsgSearch.setQueryParams({ zoneId: value });
    actions.mqMsgSearch.getEnvironment();
  }

  onEnvChange = (value) => {
    console.log('onEnvChange-->', value);
    actions.mqMsgSearch.setQueryParams({ environmentId: value });
  }

  onSubmit = () => {
    actions.mqMsgSearch.getData();
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {
      ...this.props.states.pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    };
    actions.mqMsgSearch.setPageParams({ pagination: pager });
    actions.mqMsgSearch.getData();
  }

  render() {
    const { states } = this.props;

    const { messageExt, messageTrack, messagePath } = states.data

    const zoneList = states.zoneData.map((item, i) => {
      return <Option value={item.zoneId} key={i}>{item.zoneName}</Option>
    });

    const environmentList = states.envData.map((item, i) => {
      return <Option value={item.environmentId} key={i}>{item.environmentName}</Option>
    });

    const columns = [
      {
        title: '消费组',
        dataIndex: 'consumerGroup',
      }, {
        title: '跟踪类型',
        dataIndex: 'trackType',
      }, {
        title: '异常描述',
        dataIndex: 'exceptionDesc',
        render: (value, data, index) => {
          if (value == null) {
            return '-';
          }
          return <span>{value}</span>
        }
      }
    ]

    const detailList = detailInfo.map((item, i) => item.type !== 'TextArea' ?
      <Col span={8} key={i}>
        <FormItem {...formItemLayout} label={item.label}>
          <Input disabled value={messageExt[item.valueName]} />
        </FormItem>
      </Col>
      : <Col span={8} key={i}>
        <FormItem {...formItemLayout} label={item.label}>
          <TextArea disabled autosize value={messagePath} />
        </FormItem>
      </Col>
    )

    return (
      <div className={styles.content}>
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
          <FormItem>
            <Input
              style={{ width: 245 }}
              placeholder="msgId"
              value={states.queryParams.msgId}
              onChange={(e) => actions.mqMsgSearch.setQueryParams({ msgId: e.target.value })}
            />
          </FormItem>
          <FormItem>
            <Button type='primary' icon='search' onClick={this.onSubmit}>查询</Button>
          </FormItem>
        </Form>
        <Card loading={states.loading} title='消息详情' style={{ marginTop: 20 }}>
          <Form className="ant-advanced-search-form">
            {detailList}
          </Form>
        </Card>
        <Card loading={states.loading} title='消息属性' style={{ marginTop: 20 }}>
          <Form className="ant-advanced-search-form">
            <Row>
              <Col span={24}>
                <FormItem>
                  <TextArea
                    style={{ height: 50 }}
                    value={JSON.stringify(messageExt.properties)}
                    disabled />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card loading={states.loading} title='消息追踪' style={{ marginTop: 20 }}>
          <Col span={24} >
            <Table
              bordered
              columns={columns}
              dataSource={messageTrack}
              loading={false}
              pagination={false}
            />
          </Col>
        </Card>
      </div>
    )
  }
}

export default connect(state => {
  return {
    states: state.mqMsgSearch,
  };
})(MsgSearch);
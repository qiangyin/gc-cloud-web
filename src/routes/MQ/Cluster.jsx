import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Col, Form, Select, Table, Card } from 'antd'
import styles from './Cluster.scss'

const Option = Select.Option;
const FormItem = Form.Item;

class Cluster extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // 获取地区
    actions.mqCluster.getZone();
  }

  componentWillUnmount() {
    actions.mqCluster.unmount();
  }

  onZoneChange = (value) => {
    console.log('onZoneChange-->', value);
    actions.mqCluster.setEnvParams({ zoneId: value });
    actions.mqCluster.setQueryParams({ zoneId: value });
    actions.mqCluster.getEnvironment();
  }

  onEnvChange = (value) => {
    console.log('onEnvChange-->', value);
    actions.mqCluster.setQueryParams({ environmentId: value });
    actions.mqCluster.getTableData();
  }

  onSubmit = () => {
    actions.mqCluster.getTableData();
  }

  render() {
    const { states } = this.props;

    const zoneList = states.zoneData.map((item, i) => {
      return <Option value={item.zoneId + ''} key={i}>{item.zoneName}</Option>
    });

    const environmentList = states.envData.map((item, i) => {
      return <Option value={item.environmentId + ''} key={i}>{item.environmentName}</Option>
    });

    const columns = [
      {
        title: 'brokerName',
        dataIndex: 'brokerName',
      }, {
        title: 'Bid',
        dataIndex: 'bid',
        render: (value, data, index) => {
          const list = (data.broker.map((item, i) => {
            return <p key={i}>{item.brokerId} {item.brokerId === 0 ? '(主)' : '(备)'}</p>;
          }))
          return <div>{list}</div>
        }
      }, {
        title: 'Addr',
        dataIndex: 'addr',
        render: (value, data, index) => {
          const list = (data.broker.map((item, i) => {
            return <p key={i}>{item.addr}</p>;
          }))
          return <div>{list}</div>
        }
      }, {
        title: 'InTPS',
        dataIndex: 'InTPS',
        render: (value, data, index) => {
          const list = (data.broker.map((item, i) => {
            return <p key={i}>{item.inTPS}</p>;
          }))
          return <div>{list}</div>
        }
      }, {
        title: 'OutTPS',
        dataIndex: 'OutTPS',
        render: (value, data, index) => {
          const list = (data.broker.map((item, i) => {
            return <p key={i}>{item.outTPS}</p>;
          }))
          return <div>{list}</div>
        }
      }, {
        title: 'InTotalYest',
        dataIndex: 'InTotalYest',
        render: (value, data, index) => {
          const list = (data.broker.map((item, i) => {
            return <p key={i}>{item.inTotalYest}</p>;
          }))
          return <div>{list}</div>
        }
      }, {
        title: 'OutTotalYest',
        dataIndex: 'OutTotalYest',
        render: (value, data, index) => {
          const list = (data.broker.map((item, i) => {
            return <p key={i}>{item.outTotalYest}</p>;
          }))
          return <div>{list}</div>
        }
      }, {
        title: 'InTotalToday',
        dataIndex: 'InTotalToday',
        render: (value, data, index) => {
          const list = (data.broker.map((item, i) => {
            return <p key={i}>{item.inTotalToday}</p>;
          }))
          return <div>{list}</div>
        }
      }, {
        title: 'OutTotalToday',
        dataIndex: 'OutTotalToday',
        render: (value, data, index) => {
          const list = (data.broker.map((item, i) => {
            return <p key={i}>{item.outTotalToday}</p>;
          }))
          return <div>{list}</div>
        }
      }
    ]

    const clusterList = states.tableData.map((item, i) => {
      return (
        <Card loading={states.loading} title={item.clusterName} style={{ marginBottom: 20 }} key={i }>
          <Col span={24}>
            <Table
              bordered
              columns={columns}
              dataSource={item.brokerDetail}
              loading={false}
              pagination={false}
            />
          </Col>
        </Card>
      )
    });

    return (
      <div className={styles.content}>
        <Col span={24} className={styles.headForm}>
          <Form layout='inline' >
            <FormItem label='地区'>
              <Select
                value={states.envParams.zoneId + ''}
                style={{ width: 150 }}
                onChange={this.onZoneChange}
              >
                {zoneList}
              </Select>
            </FormItem>
            <FormItem label='环境'>
              <Select
                value={states.queryParams.environmentId + ''}
                style={{ width: 150 }}
                onChange={this.onEnvChange}
              >
                {environmentList}
              </Select>
            </FormItem>
          </Form>
        </Col>
        <Col span={24} >
          {clusterList}
        </Col>
      </div>
    )
  }
}

export default connect(state => {
  return {
    states: state.mqCluster,
  };
})(Cluster);
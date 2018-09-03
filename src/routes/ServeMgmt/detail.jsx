import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Card, Col, Button, Icon, Form, Input, Table, Modal, Tag } from 'antd'
import styles from './index.scss'
import Iframe from 'react-iframe'

const Search = Input.Search;
const { TextArea } = Input;
const FormItem = Form.Item;

class ServeDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalTile: '',
      appData: {
        id: null,
        name: '',
        describe: ''
      }
    };
  }

  componentDidMount() {
    let serviceName = this.props.match.params.serviceName;
    if (serviceName){
      actions.serveDetail.getTableData(serviceName);
      actions.serveDetail.getBaseData(serviceName);
    }
  }

  componentWillUnmount() {
    actions.serveDetail.unmount();
  }

  onAdd = () => {
    actions.serveDetail.clearDataParams();
    actions.serveDetail.setDataParams({ modalTile: '容器服务/详情' });
    actions.serveDetail.showModal(true);
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {
      ...this.props.states.pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    };
    actions.serveDetail.setPageParams({ pagination: pager });
    actions.serveDetail.getTableData();
  }

  render() {
    const { states } = this.props;
    const { baseData, logModalVisable, logs, podName} = states;

    let serviceStatus = '';
    let color = '#2db7f5';
    if (baseData.serviceStatus === 0) {
      serviceStatus = '运行中',
        color = '#2db7f5';
    } else if (baseData.serviceStatus === 1) {
      serviceStatus = '已停止',
        color = '#f50';
    } else {
      serviceStatus = '状态不存在',
        color = 'red';
    }
    const columns = [
      {
        title: '容器实例',
        width: '15%',
        dataIndex: 'instanceVersion',
        key: 'instanceVersion',
      },
      {
        title: '实例ID',
        width: '15%',
        dataIndex: 'instanceId',
        key: 'instanceId',
      }, {
        title: '主机IP',
        width: '15%',
        dataIndex: 'hostIp',
        key: 'hostIp',
      }, {
        title: '容器IP',
        dataIndex: 'containerIp',
        key: 'containerIp',
      }, {
        title: '开始时间',
        width: '15%',
        dataIndex: 'startTime',
        key: 'startTime',
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (value, data, index) => {
          return [<Button type='primary' onClick={() => actions.serveDetail.getLog({
            nameSpace: 'default',
            podName: data.instanceVersion,
          })}>查看日志</Button>]
        }
        // render: (value, data, index) => {
        //   return [<Button type='primary' onClick={() => actions.serveDetail.updateState({
        //     podName: data.instanceVersion,
        //     logModalVisable: true
        //   })}>查看日志</Button>]
        // }
      }
    ]

    return (
      <div className={styles.content}>
        <Col span={24} className={styles.headForm}>
          <p><h2>容器服务/详情</h2></p>
        </Col>
        <div>
          <Col span={24} style={{ marginBottom: 30 }}>
            <Card title={`服务名称：${baseData.serviceName}`} extra={<Tag color={color}>{serviceStatus}</Tag>}>
              <ul className={styles.listInfo} style={{ listStyle: "none" }}>
                <li>
                  <span className={styles.lab}>部署模式</span>
                  <span className={styles.info}>{baseData.deployMode}</span>
                </li>
                <li>
                  <span className={styles.lab}>容器实例大小</span>
                  <span className={styles.info}>{`${baseData.cpu}核${baseData.memory}G`}</span>
                </li>
                <li>
                  <span className={styles.lab}>弹性CPU阀值</span>
                  <span className={styles.info}>{`${baseData.targetCPUUtilizationPercentage}%`}</span>
                </li>
                <li>
                  <span className={styles.lab}>创建时间</span>
                  <span className={styles.info}>{baseData.createTime}</span>
                </li>
                <li>
                  <span className={styles.lab}>更新时间</span>
                  <span className={styles.info}>2018-03-07 17：48：41</span>
                </li>
              </ul>
            </Card>
          </Col>
          <Col span={24} className={styles.headForm}>
            <Card title="容器实例">
              <Col span={24} className={styles.table}>
                <Table
                  columns={columns}
                  dataSource={states.tableData}
                  loading={states.loading}
                  pagination={false}
                />
              </Col>
            </Card>
          </Col>
        </div>
        <Modal
          title="日志"
          visible={logModalVisable}
          width={1000}
          onOk={() => {
            actions.serveDetail.updateState({
              logModalVisable:false,
              logs: []
            })
          }}
          onCancel={() => {
            actions.serveDetail.updateState({
              logModalVisable:false,
              logs: []
            })
          }}
          okText="确认"
          cancelText="取消"
        >
          {/*<Iframe url={`http://192.168.101.98:9999/content.html?namespace=default&podName=${podName}`}*/}
                  {/*width="960px"*/}
                  {/*height="340px"*/}
                  {/*display="initial"*/}
                  {/*position="relative"*/}
                  {/*allowFullScreen/>*/}
          <div style={{maxHeight: 300, overflowY: 'auto'}}>
            {logs.map(item => <p>{item}</p>)}
          </div>
        </Modal>
      </div>
    )
  }
}

export default connect(state => {
  return {
    states: state.serveDetail,
  };
})(ServeDetail);

import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Card, Col, Button, Icon, Form, Input, Table, Modal, Tabs, Tag } from 'antd'
import styles from './index.scss'
// import Loading from '../../components/Loading'

const Search = Input.Search;
const { TextArea } = Input;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;


class ConstructHistory extends PureComponent {
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
    // let projectId = '';
    // if (this.props.location.query) {
    //   projectId = this.props.location.query.projectId;
    //   actions.constructDetail.getTableData(projectId);
    // }
    actions.constructHistory.getTableData();
  }

  componentWillUnmount() {
    actions.constructHistory.unmount();
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {
      ...this.props.states.pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    };
    actions.constructHistory.setPageParams({ pagination: pager });
    actions.constructHistory.getTableData();
  }

  render() {
    const { states } = this.props;
    const { detailData, splitData, configData, logs, logModalVisable } = states;
    const columns = [
      {
        title: '用户',
        dataIndex: 'buildUser',
        key: 'buildUser',
      },
      {
        title: '构建时间',
        dataIndex: 'buildDate',
        key: 'buildDate',
      }, {
        title: '耗时',
        dataIndex: 'buildDuration',
        key: 'buildDuration',
      }, {
        title: '状态',
        dataIndex: 'buildStatus',
        key: 'buildStatus',
        render: (value, data, index) => {
          let buildState = '';
          let color = '#2db7f5';
          switch (value) {
              case 0:
                buildState = '可运行'
                color = '#2db7f5';
                break;
              case 1:
                buildState = '构建中'
                color = '#2db7f5';
                break;
              case 2:
                buildState = '构建成功'
                color = '#87d068';
                break;
              case 3:
                buildState = '构建失败'
                color = 'red';
                break;
              default:
                buildState = '错误状态返回'
            }
          return [<Tag color={color}>{buildState}</Tag>]
        },
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (value, data, index) => {
          return [<Button type='primary' onClick={() => actions.constructHistory.getLog({
            projectId: data.projectId,
            buildId: data.buildId
          })}>查看日志</Button>]
        }
      }
    ]

    return (
      <div className={styles.content}>
        <Col span={24} className={styles.headForm}>
          <p><h2>构建历史</h2></p>
        </Col>
        <div>
          <Col span={24} className={styles.headForm}>
            <Card>
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
          title={states.dataParams.modalTile}
          width={500}
          closable={true}
          visible={states.modalIsShow}
          onCancel={() => actions.serveMgmt.showModal(false)}
          footer={false}
        >
        </Modal>
        <Modal
          title="日志"
          visible={logModalVisable}
          width={700}
          onOk={() => {
            actions.constructHistory.updateState({
              logModalVisable:false,
              logs: []
            })
          }}
          onCancel={() => {
            actions.constructHistory.updateState({
              logModalVisable:false,
              logs: []
            })
          }}
          okText="确认"
          cancelText="取消"
        >
          <div style={{maxHeight: 300, overflowY: 'auto', backgroundColor: '#333', padding: '10px', color:'#aaa'}}>
            {logs.map(item => <p>{item}</p>)}
          </div>
        </Modal>
      </div>
    )
  }
}

export default connect(state => {
  return {
    states: state.constructHistory,
  };
})(ConstructHistory);

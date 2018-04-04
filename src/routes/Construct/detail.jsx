import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Card, Col, Button, Icon, Form, Input, Table, Modal, Tabs, Tag } from 'antd'
import styles from './index.scss'

const Search = Input.Search;
const { TextArea } = Input;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class ConstructDetail extends PureComponent {
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
    //   actions.constructDetail.getDetailData(projectId);
    // }

    let projectId = this.props.match.params.projectId;
    if (projectId){
      actions.constructDetail.getTableData(projectId);
      actions.constructDetail.getDetailData(projectId);
    }

  }

  componentWillUnmount() {
    actions.constructDetail.unmount();
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {
      ...this.props.states.pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    };
    actions.constructDetail.setPageParams({ pagination: pager });
    actions.constructDetail.getTableData();
  }

  render() {
    const { states } = this.props;
    const { detailData, splitData, configData, logs,  logModalVisable} = states;
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
          return [<Button type='primary' onClick={() => actions.constructDetail.getLog({
            projectId: configData.projectId,
            buildId: data.buildId
          })}>查看日志</Button>]
        }
      }
    ]

    return (
      <div className={styles.content}>
        <Col span={24} className={styles.headForm}>
          <p><h2>构建项目/构建详情</h2></p>
        </Col>
        <div>
          <Col span={24} style={{ marginBottom: 30 }}>
            <Card title={`项目名称: ${detailData.projectName}`}>
              <ul className={styles.listInfo} style={{ listStyle: "none" }}>
                <li>
                  <span className={styles.lab}>创建者</span>
                  <span className={styles.info}>{detailData.userName}</span>
                </li>
                <li>
                  <span className={styles.lab}>镜像版本</span>
                  <span className={styles.info}>{splitData[1]}</span>
                </li>
                <li>
                  <span className={styles.lab}>创建时间</span>
                  <span className={styles.info}>{detailData.createTime}</span>
                </li>
                <li>
                  <span className={styles.lab}>更新时间</span>
                  <span className={styles.info}>{detailData.updateTime}</span>
                </li>
              </ul>
            </Card>
          </Col>
          <Col span={24} className={styles.headForm}>
            <Card>
              <Tabs defaultActiveKey="1">
                <TabPane tab="构建历史" key="1">
                  <Col span={24} className={styles.table}>
                    <Table
                      columns={columns}
                      dataSource={states.tableData}
                      loading={states.loading}
                      pagination={false}
                    />
                  </Col>
                </TabPane>
                <TabPane tab="代码仓库配置" key="2">
                  <Card>
                    <ul className={styles.listInfo} style={{ listStyle: "none" }}>
                      <li>
                        <span className={styles.lab}>仓库类型</span>
                        <span className={styles.info}>{configData.repositoryType}</span>
                      </li>
                      <li>
                        <span className={styles.lab}>代码仓库下载链接</span>
                        <span className={styles.info}>{configData.codeRepository}</span>
                      </li>
                      <li>
                        <span className={styles.lab}>代码分支</span>
                        <span className={styles.info}>{configData.codeBranch}</span>
                      </li>
                      <li>
                        <span className={styles.lab}>构建目录</span>
                        <span className={styles.info}>{configData.buildDirectory}</span>
                      </li>
                      <li>
                        <span className={styles.lab}>目录名称</span>
                        <span className={styles.info}>{configData.buildName}</span>
                      </li>
                    </ul>
                  </Card>
                </TabPane>
                <TabPane tab="镜像仓库配置" key="3">
                  <Card>
                    <ul className={styles.listInfo} style={{ listStyle: "none" }}>
                      <li>
                        <span className={styles.lab}>镜像仓库源</span>
                        <span className={styles.info}>{configData.fromImage}</span>
                      </li>
                      <li>
                        <span className={styles.lab}>镜像仓库</span>
                        <span className={styles.info}>{configData.imageRepository}</span>
                      </li>
                      <li>
                        <span className={styles.lab}>镜像版本</span>
                        <span className={styles.info}>{splitData[1]}</span>
                      </li>
                      <li>
                        <span className={styles.lab}>内部运行端口</span>
                        <span className={styles.info}>{configData.exposePort}</span>
                      </li>
                    </ul>
                  </Card>
                </TabPane>
                <TabPane tab="持续集成配置" key="4">
                  <Card>
                    <ul className={styles.listInfo} style={{ listStyle: "none" }}>
                      <li>
                        <span className={styles.lab}>构建语言</span>
                        <span className={styles.info}>{configData.buildLanguage}</span>
                      </li>
                      <li>
                        <span className={styles.lab}>运行时</span>
                        <span className={styles.info}>{configData.languageVersion}</span>
                      </li>
                    </ul>
                  </Card>
                </TabPane>
              </Tabs>
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
            actions.constructDetail.updateState({
              logModalVisable:false,
              logs: []
            })
          }}
          onCancel={() => {
            actions.constructDetail.updateState({
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
    states: state.constructDetail,
  };
})(ConstructDetail);

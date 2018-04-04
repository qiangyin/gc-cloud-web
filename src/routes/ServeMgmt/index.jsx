import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Col, Button, Icon, Form, Input, Table, Modal, Switch, Tag } from 'antd'
import styles from './index.scss'

const Search = Input.Search;
const { TextArea } = Input;
const FormItem = Form.Item;

class ServeMgmt extends PureComponent {
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

  toggle = (param, status) => {
    if (!status) {
      actions.serveMgmt.getStopData(param)
    } else {
      actions.serveMgmt.getStartData(param)
    }
  }

  componentDidMount() {
    const data = {"pageSize": 1000, "pageNum": 1}
    actions.serveMgmt.getTableData(data);
  }

  componentWillUnmount() {
    actions.serveMgmt.unmount();
  }

  onAdd = () => {
    actions.serveMgmt.clearDataParams();
    actions.serveMgmt.setDataParams({ modalTile: '创建项目' });
    actions.serveMgmt.showModal(true);
  }

  onDetail = (data) => {
    actions.routing.push({
      pathname: `/serve/servedetail/${data}`
    })
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { dataParams } = this.props.states;
    if (!dataParams.name) {
      Modal.warning({
        title: '请输入项目名称',
      });
      return false;
    }

    if (!dataParams.describe) {
      Modal.warning({
        title: '请输入项目描述',
      });
      return false;
    }

    if (dataParams.id) {
      actions.appMgmt.editApp();
    } else {
      actions.appMgmt.addApp();
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {
      ...this.props.states.pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    };
    actions.serveMgmt.setPageParams({ pagination: pager });
    actions.serveMgmt.getTableData();
  }

  render() {
    const { states } = this.props;
    const { tableData, data } = states;

    const columns = [
      {
        title: '服务名称',
        dataIndex: 'serviceName',
        key: 'serviceName',
        render: value => <Button ghost style={{border:'none', color:'#108ee9', fontSize: '9', opacity:'0.65'}} onClick={()=>this.onDetail(value)}>{value}</Button>,
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        key: 'projectName',
      }, {
        title: '状态',
        dataIndex: 'serviceStatus',
        key: 'serviceStatus',
        render: (value) => {
          let color = '#87d068';
          if (value === '0') {
            color = '#f50'
          }
          return [<Tag color={color} >{!value ? '运行中':'已停止'}</Tag>]
        },
      }, {
        title: '镜像',
        dataIndex: 'serviceImage',
        key: 'serviceImage',
      }, {
        title: '内部运行地址',
        dataIndex: 'insideAddress',
        key: 'insideAddress',
      }, {
        title: '外部运行地址',
        dataIndex: 'outsideAddress',
        key: 'outsideAddress',
      }, {
        title: '版本',
        dataIndex: 'serviceVersion',
        key: 'serviceVersion',
      }, {
        title: '大小',
        dataIndex: 'memory',
        key: 'memory',
        render: (value, data, index) => {
          return [<span>{`${data.cpu}核${data.memory}G`}</span>]
        }
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (value, data, index) => {
          return [<Switch checkedChildren="开始" unCheckedChildren="停止" checked={data.serviceStatus}  onClick={() => this.toggle(data.serviceName, data.serviceStatus)} />]
        }
      }
    ]

    return (
      <div className={styles.content}>
        <Col span={24} className={styles.headForm}>
          <Button type='primary' icon='plus' size='large' onClick={() => actions.routing.push('/serve/create')}>创建服务</Button>
        </Col>
        <Col span={24} className={styles.table}>
          <Table
            columns={columns}
            dataSource={tableData}
            loading={states.loading}
            pagination={false}
          />
        </Col>
        <Modal
          title={states.dataParams.modalTile}
          width={500}
          closable={true}
          visible={states.modalIsShow}
          onCancel={() => actions.serveMgmt.showModal(false)}
          footer={false}
        >
          <Form onSubmit={this.onSubmit}>
            <FormItem
              hasFeedback
              label="项目名称"
              required
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
            >
              <Input
                value={states.dataParams.name}
                onChange={(e) => { actions.serveMgmt.setDataParams({ name: e.target.value }) }}
                placeholder="项目名称不超过20个字"
              />
            </FormItem>
            <FormItem
              hasFeedback
              label="项目描述"
              required
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
            >
              <TextArea rows={4}
                value={states.dataParams.describe}
                onChange={(e) => { actions.serveMgmt.setDataParams({ describe: e.target.value }) }}
                placeholder="项目描述不超过50个字"
              />
            </FormItem>
            <FormItem
              wrapperCol={{ span: 24, offset: 14 }}
            >
              <Button key="back" onClick={() => actions.serveMgmt.showModal(false)}>取消</Button>,
              <Button ref='btn' type="primary" htmlType="submit" icon='check'>
                提交
            </Button>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default connect(state => {
  return {
    states: state.serveMgmt,
  };
})(ServeMgmt);

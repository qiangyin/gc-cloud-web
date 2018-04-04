import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Col, Button, Icon, Form, Input, Table, Modal, Tag } from 'antd'
import styles from './index.scss'

const Search = Input.Search;
const { TextArea } = Input;
const FormItem = Form.Item;

class Construct extends PureComponent {
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
    actions.construct.getTableData({"pageSize": 1000, "pageNum": 1})
  }

  componentWillUnmount() {
    actions.construct.unmount();
  }

  reConstruct = (data)=> {
    actions.construct.startUp(data);
  }

  onDetail = (data) => {
    actions.routing.push({
      pathname: `/build/constructdetail/${data}`
    })
  }

  onAdd = () => {
    actions.construct.clearDataParams();
    actions.construct.setDataParams({ modalTile: '创建项目' });
    actions.construct.showModal(true);
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
      actions.construct.editApp();
    } else {
      actions.construct.addApp();
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {
      ...this.props.states.pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    };
    actions.construct.setPageParams({ pagination: pager });
    actions.construct.getTableData();
  }

  render() {
    const { states } = this.props;
    
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'projectName',
        key: 'projectName',
        render: (value, data, index) => <Button ghost style={{border:'none', color:'#108ee9', fontSize: '9', opacity:'0.65'}} onClick={()=>this.onDetail(data.projectId)}>{value}</Button>,
      }, {
        title: '状态',
        dataIndex: 'projectStatus',
        key: 'projectStatus',
        render: (value, data, index) => {
          let projectStatus = '';
          let color = '#2db7f5';
          switch (value) {
              case 0:
                projectStatus = '可运行'
                color = '#2db7f5';
                break;
              case 1:
                projectStatus = '构建中'
                color = '#2db7f5';
                break;
              case 2:
                projectStatus = '构建成功'
                color = '#87d068';
                break;
              case 3:
                projectStatus = '构建失败'
                color = '#f50';
                break;
              default:
                projectStatus = '错误状态返回'
                color = 'red';
            }
          return [<Tag color={color}>{projectStatus}</Tag>]
        },
      }, {
        title: '代码仓库',
        dataIndex: 'codeRepository',
        key: 'codeRepository',
      }, {
        title: '代码分支',
        dataIndex: 'codeBranch',
        key: 'codeBranch',
      }, {
        title: '镜像仓库',
        dataIndex: 'imageRepository',
        key: 'imageRepository',
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (value, data, index) => {
          let isDisabled = false;
          if (data.projectStatus === 1){
            isDisabled = true
          }
          return [<Button type='primary' disabled={isDisabled} onClick={() => this.reConstruct(data.projectId)}>重新构建</Button>]
        }
      }
    ]

    return (
      <div className={styles.content}>
        <Col span={24} className={styles.headForm}>
          <Button type='primary' icon='plus' size='large' onClick={() => actions.routing.push('/build/create')}>构建项目</Button>
          <Button type='primary' icon='reload' style={{float:'right'}} size='large' onClick={() => actions.construct.getTableData({"pageSize": 1000, "pageNum": 1})}>刷新</Button>
        </Col>
        <Col span={24} className={styles.table}>
          <Table
            columns={columns}
            dataSource={states.tableData}
            loading={states.loading}
            pagination={false}
          />
        </Col>
        <Modal
          title={states.dataParams.modalTile}
          width={500}
          closable={true}
          visible={states.modalIsShow}
          onCancel={() => actions.construct.showModal(false)}
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
                onChange={(e) => { actions.construct.setDataParams({ name: e.target.value }) }}
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
                onChange={(e) => { actions.construct.setDataParams({ describe: e.target.value }) }}
                placeholder="项目描述不超过50个字"
              />
            </FormItem>
            <FormItem
              wrapperCol={{ span: 24, offset: 14 }}
            >
              <Button key="back" onClick={() => actions.construct.showModal(false)}>取消</Button>,
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
    states: state.construct,
  };
})(Construct);

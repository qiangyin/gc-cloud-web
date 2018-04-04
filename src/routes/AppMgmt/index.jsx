import React, { PureComponent } from 'react'
import { actions, connect } from 'mirrorx';
import { Row, Col, Button, Icon, Form, Input, Table, Modal } from 'antd'
import styles from './index.scss'

const Search = Input.Search;
const { TextArea } = Input;
const FormItem = Form.Item;

class AppMgmt extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalTile: '',
    };
  }

  componentDidMount() {
    actions.appMgmt.getTableData();
  }

  componentWillUnmount() {
    actions.appMgmt.unmount();
  }

  onAdd = () => {
    actions.appMgmt.clearDataParams();
    actions.appMgmt.setDataParams({ modalTile: '创建项目' });
    actions.appMgmt.showModal(true);
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

    if (!dataParams.des) {
      Modal.warning({
        title: '请输入项目描述',
      });
      return false;
    }
    actions.appMgmt.addApp();
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {
      ...this.props.states.pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    };
    actions.appMgmt.setPageParams({ pagination: pager });
    actions.appMgmt.getTableData();
  }

  render() {
    const { states } = this.props;

    const columns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '创建人',
        dataIndex: 'userName',
        key: 'userName',
      }, {
        title: '项目描述',
        dataIndex: 'des',
        key: 'des',
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      }
    ]

    return (
      <div className={styles.content}>
        <Col span={24} className={styles.headForm}>
          <Button type='primary' icon='plus' size='large' onClick={this.onAdd}>创建项目</Button>
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
          onCancel={() => actions.appMgmt.showModal(false)}
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
                onChange={(e) => { actions.appMgmt.setDataParams({ name: e.target.value }) }}
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
                value={states.dataParams.des}
                onChange={(e) => { actions.appMgmt.setDataParams({ des: e.target.value }) }}
                placeholder="项目描述不超过50个字"
              />
            </FormItem>
            <FormItem
              wrapperCol={{ span: 24, offset: 14 }}
            >
              <Button key="back" onClick={() => actions.appMgmt.showModal(false)}>取消</Button>,
              <Button ref='btn' type="primary" htmlType="submit">
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
    states: state.appMgmt,
  };
})(AppMgmt);

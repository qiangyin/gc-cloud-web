import React, {PureComponent} from 'react'
import { Form, Icon, Input, Button, Select} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;



const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 4 },
}

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class StepOne extends React.Component {
  componentDidMount() {

  }

  render() {
    const {onChange, data, projectId} = this.props
    let {projectList} = data
    return (
      <Form layout="horizontal">
        <FormItem
          label="项目名称"
          {...formItemLayout}
          // validateStatus={projectId.validateStatus}
          // help={projectId.errorMsg || ''}
        >
          <Select value={projectId.value} placeholder="请选择项目名称" onChange={value => onChange({
            projectId: {
              value
            }
          })}>
            {
              projectList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
            }
          </Select>
        </FormItem>
      </Form>
    );
  }
}

export default StepOne;

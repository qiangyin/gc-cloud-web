import React, {PureComponent} from 'react'
import { Form, Icon, Input, Button, Select} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 4 },
}

class StepOne extends React.Component {
  componentDidMount() {

  }

  render() {
    const {onChange, data, imageStoreName} = this.props
    let {harborProjects} = data
    return (
      <Form layout="horizontal">
        <FormItem
          label="镜像仓库"
          {...formItemLayout}
        >
          <Select value={imageStoreName.value} placeholder="请选择镜像仓库" onChange={value => onChange({
            imageStoreName: {
              value
            }
          })}>
            {
              harborProjects.map(item => <Option key={item} value={item.name}>{item.name}</Option>)
            }
          </Select>
        </FormItem>
      </Form>
    );
  }
}

export default StepOne;

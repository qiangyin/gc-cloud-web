import React, {PureComponent} from 'react'
import {Form, Icon, Input, Button, Select, Radio, InputNumber} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;


const formItemLayout = {
  labelCol: {span: 10},
  wrapperCol: {span: 4},
}

class StepFour extends React.Component {
  componentDidMount() {

  }

  render() {
    const {onChange, data, imageName, imageRepository, exposePort} = this.props
    let {imageRepositorys} = data
    return (
      <Form layout="horizontal">
        <FormItem
          label="选择镜像仓库"
          {...formItemLayout}
        >
          <Select value={imageRepository.value} placeholder="请选择镜像仓库" onChange={value => onChange({
            imageRepository: {
              value
            }
          })}>
            {
              imageRepositorys.map(item => <Option key={item.name} value={item.name}>{item.name}</Option>)
            }
          </Select>
        </FormItem>
        <FormItem
          label="镜像版本"
          value={imageName}
          {...formItemLayout}
        >
          <Input value={imageName.value} onChange={e => onChange({
            imageName: {
              value: e.target.value
            }
          })} placeholder='name:version' />
        </FormItem>
        <FormItem
          value={exposePort}
          label="内部运行端口"
          min={0}
          {...formItemLayout}
        >
          <span style={{float: 'left'}}>
            <InputNumber value={exposePort.value} onChange={value => onChange({
              exposePort: {
                value
              }
            })}/>
          </span>
        </FormItem>
      </Form>
    );
  }
}

export default StepFour;

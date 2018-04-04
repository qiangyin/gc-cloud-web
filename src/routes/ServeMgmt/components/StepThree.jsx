import React, {PureComponent} from 'react'
import {Form, Icon, Input, Button, Select, Radio, InputNumber} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;


const formItemLayout = {
  labelCol: {span: 10},
  wrapperCol: {span: 4},
}

class StepThree extends React.Component {
  componentDidMount() {

  }

  render() {
    const {onChange, data, serviceType, maxReplicas, minReplicas, targetCPUUtilizationPercentage} = this.props
    let {targetCPUUtilizationPercentageList} = data
    return (
      <Form layout="horizontal">
        <FormItem
          label="服务类型"
          {...formItemLayout}
        >
          <span style={{float: 'left'}}>
            {serviceType.value}
          </span>
        </FormItem>
        <FormItem
          label="容器实例最大值"
          {...formItemLayout}
        >
          <span style={{float: 'left'}}>
            <InputNumber min={0} value={maxReplicas.value} onChange={value => onChange({
              maxReplicas: {
                value
              }
            })}/>
          </span>
        </FormItem>
        <FormItem
          label="容器实例最小值"
          {...formItemLayout}
        >
           <span style={{float: 'left'}}>
             <InputNumber min={0} value={minReplicas.value} onChange={value => onChange({
               minReplicas: {
                 value
               }
             })}/>
             </span>
        </FormItem>
        <FormItem
          label="弹性CPU阈值"
          {...formItemLayout}
        >
          <Select value={targetCPUUtilizationPercentage.value} placeholder="请选择弹性伸缩阈值" onChange={value => onChange({
            targetCPUUtilizationPercentage: {
              value
            }
          })}>
            {
              targetCPUUtilizationPercentageList.map(item => <Option key={item.value} value={item.value}>{item.value}%</Option>)
            }
          </Select>
        </FormItem>
      </Form>
    );
  }
}

export default StepThree;

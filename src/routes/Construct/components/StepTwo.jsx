import React, {PureComponent} from 'react'
import { Form, Icon, Input, Button, Select, Radio} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;



const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 8 },
}

class StepTwo extends React.Component {
  componentDidMount() {

  }

  render() {
    const {onChange, data, codeRepository, codeBranch, buildDirectory, buildName} = this.props
    let {groupsProjects, branches} = data
    return (
      <Form layout="horizontal">
        <FormItem
          label="仓库类型"
          {...formItemLayout}
        >
          <span style={{float: 'left'}}>
            <Radio defaultChecked={true}>GIT</Radio>
          </span>
        </FormItem>
        <FormItem
          label="代码仓库下载链接"
          {...formItemLayout}
        >
          <Select value={codeRepository.value}  placeholder="请选择镜像仓库" onChange={value => onChange({
            codeRepository: {
              value
            }
          })}>
            {
              groupsProjects.map(item => <Option key={item.httpUrl} value={item.httpUrl}>{item.httpUrl}</Option>)
            }
          </Select>
        </FormItem>
        <FormItem
          label="代码分支"
          {...formItemLayout}
        >
          <Select value={codeBranch.value}  placeholder="填写代码分支" onChange={value => onChange({
            codeBranch: {
              value
            }
          })}>
            {
              branches.map(item => <Option key={item.name} value={item.name}>{item.name}</Option>)
            }
          </Select>
        </FormItem>
        <FormItem
          label="构建目录"
          {...formItemLayout}
        >
          <Input value={buildDirectory.value} onChange={e => onChange({
            buildDirectory: {
              value: e.target.value
            }
          })} />
        </FormItem>
        <FormItem
          label="构建名称"
          {...formItemLayout}
        >
          <Input value={buildName.value} onChange={e => onChange({
            buildName: {
              value: e.target.value
            }
          })} placeholder='name-1.0.0-SNAPSHOT.jar' />
        </FormItem>
      </Form>
    );
  }
}

export default StepTwo;

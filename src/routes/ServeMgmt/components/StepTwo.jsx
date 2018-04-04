import React, {PureComponent} from 'react'
import {Form, Icon, Input, Button, Select, Radio, Row, Col} from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {span: 10},
  wrapperCol: {span: 8},
}

class StepTwo extends React.Component {
  componentDidMount() {

  }

  render() {
    const {
      onChange,
      data,
      imageStoreName,
      imageName,
      imageVersion,
      serviceName,
      projectName,
      serviceConfigId,
      deployMode,
    } = this.props
    let {harborRepositories, haborTags, projectList, serviceConfigList} = data
    return (
      <Form layout="horizontal">
        <FormItem
          label="镜像仓库名称"
          {...formItemLayout}
        >
          <span style={{float: 'left'}}>
            {imageStoreName.value}
          </span>
        </FormItem>
        <FormItem
          label="镜像版本"
          {...formItemLayout}
        >
          <Row>
            <Col span={11}>
              <Select value={imageName.value} placeholder="请选择镜像" onChange={value => {
                onChange({
                  imageName: {
                    value
                  },
                  imageVersion: {}
                })
              }}>
                {
                  harborRepositories.map(item => <Option key={item.name} value={item.name}>{item.name}</Option>)
                }
              </Select>
            </Col>
            <Col span={11} offset={2}>
              <Select value={imageVersion.value} placeholder="请选择镜像版本" onChange={value => onChange({
                imageVersion: {
                  value
                }
              })}>
                {
                  haborTags.map(item => <Option key={item.tag} value={item.tag}>{item.tag}</Option>)
                }
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem
          label="服务名称"
          {...formItemLayout}
        >
          <Input value={serviceName.value} serviceName={serviceName.value} onChange={e => onChange({
            serviceName: {
              value: e.target.value
            }
          })}/>
        </FormItem>
        <FormItem
          label="项目名称"
          {...formItemLayout}
        >
          <Select value={projectName.value} placeholder="请选择项目名称" onChange={value => onChange({
            projectName: {
              value
            }
          })}>
            {
              projectList.map(item => <Option key={item.name} value={item.name}>{item.name}</Option>)
            }
          </Select>
        </FormItem>
        <FormItem
          label="部署模式"
          {...formItemLayout}
        >
          <span style={{float: 'left'}}>
            {deployMode.value}
          </span>
        </FormItem>
        <FormItem
          label="实例大小"
          {...formItemLayout}
        >
          <span>

            <RadioGroup value={serviceConfigId.value} onChange={e => {
              onChange({
                serviceConfigId: {
                  value: e.target.value
                }
              })
            }}>
               {
                 serviceConfigList.map(item => <Radio key={item.cpu + '-' + item.memory} value={item.id}>{item.cpu}核 {item.mem}GB</Radio>)
               }
            </RadioGroup>
          </span>
        </FormItem>
      </Form>
    );
  }
}

export default StepTwo;

import React, {PureComponent} from 'react'
import { Form, Icon, Input, Button, Select, Radio} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;



const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 4 },
}

class StepThree extends React.Component {
  componentDidMount() {

  }

  render() {
    const {onChange, data, buildLanguage, languageVersion} = this.props
    let {runtimeList} = data
    let languageVersionList = runtimeList.filter(item => item.language === buildLanguage.value)
    return (
      <Form layout="horizontal">
        <FormItem
          label="构建语言"
          {...formItemLayout}
        >
          <Select value={buildLanguage.value}  placeholder="请选择" onChange={value => onChange({
            buildLanguage: {
              value
            },
            languageVersion: {}
          })}>
            {
              runtimeList.map(item => <Option key={item.language} value={item.language}>{item.language}</Option>)
            }
          </Select>
        </FormItem>
        <FormItem
          label="运行时"
          {...formItemLayout}
        >
          <Select value={languageVersion.value}   placeholder="请选择" onChange={value => onChange({
            languageVersion: {
              value
            }
          })}>
            {
              languageVersionList.length > 0 ?
                languageVersionList[0].config.map(item => <Option ke={item} value={item}>{item}</Option>)
                : null
            }
          </Select>
        </FormItem>
      </Form>
    );
  }
}

export default StepThree;

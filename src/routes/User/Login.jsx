import React, { Component } from 'react';
import { actions, connect, Link } from 'mirrorx';
import { Form, Input, Tabs, Select, Button, Icon, Checkbox, Row, Col, Alert } from 'antd';
import styles from './Login.scss';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Option } = Select;

import logo from './images/logo.png'

class Login extends Component {
	componentWillReceiveProps(nextProps) {
		if (nextProps.states.info && nextProps.states.info.code === 200) {
			actions.routing.push('/');
		}
	}

	componentWillUnmount() {
		actions.login.unmount();
	}

	onSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				actions.login.loginRequest(values);
			}
		});
	}

	render() {
		const { form, states } = this.props;
		const { getFieldDecorator } = form;
		return (
			<div className={styles.login}>
				<div className={styles.header}>
					<Col offset={3} span={21} className={styles.headerImg}>
						<img src={logo} />
					</Col>
				</div>
				<div className={styles.main}>

					<Form onSubmit={this.onSubmit} className={styles.form} hideRequiredMark={true}>
						<Col span={24} className={styles.title}>密码登录</Col>
						<FormItem hasFeedback label="用户名"
							labelCol={{ span: 5 }}
							wrapperCol={{ span: 17 }}
							colon={false}
						>
							{getFieldDecorator('userName', {
								rules: [{
									required: true, whitespace: true, message: '请输入账户名！',
								}],
							})(
								<Input
									// prefix={<Icon type="user" className={styles.prefixIcon} />}
									size='default'
									placeholder="域账号"
								/>
								)}
						</FormItem>
						<FormItem
							required
							hasFeedback
							label="密码"
							labelCol={{ span: 5 }}
							wrapperCol={{ span: 17 }}
							colon={false}
						>
							{getFieldDecorator('password', {
								rules: [{
									required: true, whitespace: true, message: '请输入密码！',
								}],
							})(
								<Input
									// prefix={<Icon type="lock" className={styles.prefixIcon} />}
									size='default'
									type="password"
									placeholder="密码"
								/>
								)}
						</FormItem>
						<FormItem
							labelCol={{ span: 5 }}
							wrapperCol={{ span: 17 }}
							colon={false}
							label="公司"
						>
							{
								getFieldDecorator('domainType', {
									initialValue: '1',
								})(
									<Select
										placeholder="公司"
										size='default'
									>
										<Option value={'1'} >国美电器</Option>
										<Option value={'2'}>国美在线</Option>
									</Select>
									)
							}
						</FormItem>
						<FormItem className={styles.additional} wrapperCol={{ span: 17, offset: 5 }}>
							<Button loading={states.submitting} className={styles.submit} type="primary" htmlType="submit">
								登录
							</Button>
						</FormItem>
					</Form>
				</div>
			</div>
		);
	}
}

const LoginForm = Form.create()(Login);
export default connect(state => {
	return { states: state.login };
})(LoginForm);

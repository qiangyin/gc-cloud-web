import React, {PureComponent} from 'react'
import {actions, connect} from 'mirrorx';
import {Row, Col, List, Table, Card, Button, Modal, Select, Steps, message} from 'antd'

const Step = Steps.Step;
import StepOne from './components/StepOne'
import StepTwo from './components/StepTwo'
import StepThree from './components/StepThree'
import StepFour from './components/StepFour'

import styles from './assets/style.scss'


class Create extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    actions.buildCreate.unmount();
  }


  componentWillMount() {
    actions.buildCreate.getProjectList()
    actions.buildCreate.getRuntimeList()
    actions.buildCreate.getImageProjects()
  }

  getStepContent() {
    const {states} = this.props;
    const {current, steps, projectList, groupsProjects, runtimeList, branches, imageRepositorys} = states;
    if (current === 0) return <StepOne {...steps[current].fields} data={{projectList}} onChange={(data) => {
      steps[current].fields = {
        ...steps[current].fields,
        ...data
      }
      actions.buildCreate.updateSteps({
        steps
      })
    }}/>

    if (current === 1) return <StepTwo {...steps[current].fields} data={{groupsProjects, branches}} onChange={(data) => {
      if(data.codeRepository && data.codeRepository.value) {
        actions.buildCreate.gitlabProjectsBranches({projectId: groupsProjects.filter(item => item.httpUrl === data.codeRepository.value)[0].id})
      }

      steps[current].fields = {
        ...steps[current].fields,
        ...data
      }
      actions.buildCreate.updateSteps({
        steps
      })
    }}/>

    if (current === 2) return <StepThree {...steps[current].fields} data={{runtimeList}} onChange={(data) => {
      steps[current].fields = {
        ...steps[current].fields,
        ...data
      }
      actions.buildCreate.updateSteps({
        steps
      })
    }}/>

    if (current === 3) return <StepFour {...steps[current].fields} data={{imageRepositorys}} onChange={(data) => {
      steps[current].fields = {
        ...steps[current].fields,
        ...data
      }
      actions.buildCreate.updateSteps({
        steps
      })
    }}/>
  }

  render() {
    const {states} = this.props;
    const {current, steps, submitBtnStatus} = states;

    return (
      <Card hoverable='false'>
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title}/>)}
        </Steps>
        <div className={styles["steps-content"]}>
          {
            this.getStepContent(current)
          }
        </div>
        <div className={styles["steps-action"]}>
          <Button onClick={() => actions.routing.push('/build/constructlist')}>取消</Button>
          {
            current > 0
            &&
            <Button style={{marginLeft: 8}} onClick={() => actions.buildCreate.stepButtonOp({type: 'prev'})}>
              上一步
            </Button>
          }
          {
            current < steps.length - 1
            &&
            <Button type="primary" disabled={submitBtnStatus ? '' : 'disabled'}
                    onClick={() => actions.buildCreate.stepButtonOp({type: 'next'})}>下一步</Button>
          }
          {
            current === steps.length - 1
            &&
            <Button type="primary" disabled={submitBtnStatus ? '' : 'disabled'}
                    onClick={() => {
                      actions.buildCreate.buildCreate()
                    }}>创建</Button>
          }

        </div>
      </Card>
    )
  }
}

export default connect(state => {
  return {
    states: state.buildCreate,
  };
})(Create);

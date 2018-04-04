import React, {PureComponent} from 'react'
import {actions, connect} from 'mirrorx';
import {Row, Col, List, Table, Card, Button, Modal, Select, Steps, message} from 'antd'
const Step = Steps.Step;
import StepOne from './components/StepOne'
import StepTwo from './components/StepTwo'
import StepThree from './components/StepThree'

import styles from './assets/style.scss'


class Create extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    actions.serveCreate.getImageProjects()
    actions.serveCreate.getProjectList()
    actions.serveCreate.serviceConfigList()
  }

  componentWillUnmount() {
    actions.serveCreate.unmount();
  }


  getStepContent() {
    const {states} = this.props;
    const {
      current,
      steps,
      harborProjects,
      harborRepositories,
      projectList,
      serviceConfigList,
      targetCPUUtilizationPercentageList,
      haborTags
    } = states;
    if (current === 0) return <StepOne {...steps[current].fields} data={{harborProjects}} onChange={(data) => {
      steps[current].fields = {
        ...steps[current].fields,
        ...data
      }
      actions.serveCreate.updateSteps({
        steps
      })
    }}/>

    if (current === 1) {
      return <StepTwo {...steps[current].fields} data={{harborRepositories, haborTags, projectList, serviceConfigList}} onChange={(data) => {
        if (data.imageName && data.imageName.value) {
          actions.serveCreate.getHaborTags({
            imageName: data.imageName.value
          })
        }

        steps[current].fields = {
          ...steps[current].fields,
          ...data
        }
        actions.serveCreate.updateSteps({
          steps
        })
      }}/>
    }

    if (current === 2) {
      return <StepThree {...steps[current].fields} data={{targetCPUUtilizationPercentageList}} onChange={(data) => {
        steps[current].fields = {
          ...steps[current].fields,
          ...data
        }
        actions.serveCreate.updateSteps({
          steps
        })
      }}/>
    }
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
          <Button onClick={() => actions.routing.push('/serve/servelist')}>取消</Button>
          {
            current > 0
            &&
            <Button style={{marginLeft: 8}} onClick={() => actions.serveCreate.stepButtonOp({type: 'prev'})}>
              上一步
            </Button>
          }
          {
            current < steps.length - 1
            &&
            <Button type="primary" disabled={submitBtnStatus ? '' : 'disabled'}
                    onClick={() => actions.serveCreate.stepButtonOp({type: 'next'})}>下一步</Button>
          }
          {
            current === steps.length - 1
            &&
            <Button type="primary" disabled={submitBtnStatus ? '' : 'disabled'}
                    onClick={() => {
                      actions.serveCreate.serveCreate()
                    }}>创建</Button>
          }

        </div>
      </Card>
    )
  }
}

export default connect(state => {
  return {
    states: state.serveCreate,
  };
})(Create);

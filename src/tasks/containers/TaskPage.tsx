import _ from 'lodash'
import React, {PureComponent, ChangeEvent} from 'react'
import {InjectedRouter} from 'react-router'
import {connect} from 'react-redux'

import TaskForm from 'src/tasks/components/TaskForm'
import TaskHeader from 'src/tasks/components/TaskHeader'
import {Page} from 'src/pageLayout'

import {Links} from 'src/types/v2/links'
import {State as TasksState} from 'src/tasks/reducers/v2'
import {
  setNewScript,
  saveNewScript,
  goToTasks,
  setTaskOption,
  setScheduleUnit,
} from 'src/tasks/actions/v2'
import {TaskOptions, TaskSchedule} from 'src/utils/taskOptionsToFluxScript'
import {Organization} from 'src/types/v2'

interface PassedInProps {
  router: InjectedRouter
}

interface ConnectStateProps {
  orgs: Organization[]
  taskOptions: TaskOptions
  newScript: string
  tasksLink: string
}

interface ConnectDispatchProps {
  setNewScript: typeof setNewScript
  saveNewScript: typeof saveNewScript
  goToTasks: typeof goToTasks
  setTaskOption: typeof setTaskOption
  setScheduleUnit: typeof setScheduleUnit
}

class TaskPage extends PureComponent<
  PassedInProps & ConnectStateProps & ConnectDispatchProps
> {
  constructor(props) {
    super(props)
  }

  public render(): JSX.Element {
    const {newScript, taskOptions, orgs} = this.props

    return (
      <Page>
        <TaskHeader
          title="Create Task"
          onCancel={this.handleCancel}
          onSave={this.handleSave}
        />
        <Page.Contents fullWidth={true} scrollable={false}>
          <TaskForm
            orgs={orgs}
            script={newScript}
            taskOptions={taskOptions}
            onChangeInput={this.handleChangeInput}
            onChangeScheduleType={this.handleChangeScheduleType}
            onChangeScript={this.handleChangeScript}
            onChangeScheduleUnit={this.handleChangeScheduleUnit}
            onChangeTaskOrgID={this.handleChangeTaskOrgID}
          />
        </Page.Contents>
      </Page>
    )
  }

  private handleChangeScript = (script: string) => {
    this.props.setNewScript(script)
  }

  private handleChangeScheduleType = (schedule: TaskSchedule) => {
    this.props.setTaskOption({key: 'taskScheduleType', value: schedule})
  }

  private handleSave = () => {
    this.props.saveNewScript()
  }

  private handleCancel = () => {
    this.props.goToTasks()
  }

  private handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const {name: key, value} = e.target

    this.props.setTaskOption({key, value})
  }

  private handleChangeScheduleUnit = (unit: string, scheduleType: string) => {
    this.props.setScheduleUnit(unit, scheduleType)
  }

  private handleChangeTaskOrgID = (orgID: string) => {
    this.props.setTaskOption({key: 'orgID', value: orgID})
  }
}

const mstp = ({
  tasks,
  links,
  orgs,
}: {
  tasks: TasksState
  links: Links
  orgs: Organization[]
}): ConnectStateProps => {
  return {
    orgs,
    taskOptions: tasks.taskOptions,
    newScript: tasks.newScript,
    tasksLink: links.tasks,
  }
}

const mdtp: ConnectDispatchProps = {
  setNewScript,
  saveNewScript,
  goToTasks,
  setTaskOption,
  setScheduleUnit,
}

export default connect<ConnectStateProps, ConnectDispatchProps, {}>(
  mstp,
  mdtp
)(TaskPage)

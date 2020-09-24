// Libraries
import React, {PureComponent} from 'react'
import {connect, ConnectedProps} from 'react-redux'

// Components
import {
  Button,
  ComponentColor,
  ComponentSize,
  ComponentStatus,
  IconFont,
} from '@influxdata/clockface'

// Actions
import {saveAndExecuteQueries} from 'src/timeMachine/actions/queries'
import {notify} from 'src/shared/actions/notifications'

// Utils
import {getActiveTimeMachine, getActiveQuery} from 'src/timeMachine/selectors'
import {event} from 'src/cloud/utils/reporting'
import {queryCancelRequest} from 'src/shared/copy/notifications'
import {delayEnableCancelBtn} from 'src/shared/actions/app'
import {cancelPendingResults} from 'src/timeMachine/actions/queries'

// Types
import {AppState, RemoteDataState} from 'src/types'

interface OwnProps {
  text?: string
  icon?: IconFont
  testID?: string
  className?: string
}

type ReduxProps = ConnectedProps<typeof connector>
type Props = OwnProps & ReduxProps

class SubmitQueryButton extends PureComponent<Props> {
  public static defaultProps = {
    text: 'Submit',
    testID: 'time-machine-submit-button',
  }

  public state = {
    timer: false,
  }

  private timer

  public componentDidUpdate(prevProps) {
    if (
      this.props.queryStatus !== prevProps.queryStatus &&
      prevProps.queryStatus === RemoteDataState.Loading &&
      this.timer
    ) {
      clearTimeout(this.timer)
      delete this.timer
    }
  }

  public render() {
    const {
      className,
      icon,
      queryStatus,
      testID,
      text,
      shouldShowCancelBtn,
    } = this.props

    if (queryStatus === RemoteDataState.Loading && shouldShowCancelBtn) {
      return (
        <Button
          text="Cancel"
          className={className}
          icon={icon}
          size={ComponentSize.Small}
          status={ComponentStatus.Default}
          onClick={this.handleCancelClick}
          color={ComponentColor.Danger}
          testID={testID}
          style={{width: '100px'}}
        />
      )
    }
    return (
      <Button
        text={text}
        className={className}
        icon={icon}
        size={ComponentSize.Small}
        status={this.buttonStatus}
        onClick={this.handleClick}
        color={ComponentColor.Primary}
        testID={testID}
        style={{width: '100px'}}
      />
    )
  }

  private get buttonStatus(): ComponentStatus {
    const {queryStatus, submitButtonDisabled} = this.props

    if (submitButtonDisabled) {
      return ComponentStatus.Disabled
    }

    if (queryStatus === RemoteDataState.Loading) {
      return ComponentStatus.Loading
    }

    return ComponentStatus.Default
  }

  private handleClick = (): void => {
    event('SubmitQueryButton click')
    // We need to instantiate a new AbortController per request
    // In order to allow for requests after cancellations:
    // https://stackoverflow.com/a/56548348/7963795

    this.timer = this.props.onSetCancelBtnTimer()
    this.props.onSubmit()
  }

  private handleCancelClick = (): void => {
    if (this.props.onNotify) {
      this.props.onNotify(queryCancelRequest())
    }
    cancelPendingResults()
  }
}

export {SubmitQueryButton}

const mstp = (state: AppState) => {
  const {shouldShowCancelBtn} = state.app.ephemeral
  const submitButtonDisabled = getActiveQuery(state).text === ''
  const queryStatus = getActiveTimeMachine(state).queryResults.status

  return {shouldShowCancelBtn, submitButtonDisabled, queryStatus}
}

const mdtp = {
  onSetCancelBtnTimer: delayEnableCancelBtn,
  onSubmit: saveAndExecuteQueries,
  onNotify: notify,
}

const connector = connect(mstp, mdtp)

export default connector(SubmitQueryButton)

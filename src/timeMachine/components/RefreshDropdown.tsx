// Libraries
import React, {PureComponent} from 'react'
import {connect, ConnectedProps} from 'react-redux'
import {isEqual} from 'lodash'

// Components
import AutoRefreshDropdown from 'src/shared/components/dropdown_auto_refresh/AutoRefreshDropdown'

// Utils
import {AutoRefresher} from 'src/utils/AutoRefresher'
import {event} from 'src/cloud/utils/reporting'
import {
  clearCancelBtnTimeout,
  delayEnableCancelBtn,
  resetCancelBtnState,
} from 'src/shared/actions/app'
import {shouldShowCancelBtnSelector} from 'src/shared/selectors/app'

// Actions
import {executeQueries} from 'src/timeMachine/actions/queries'
import {setAutoRefresh} from 'src/timeMachine/actions'
import {getActiveTimeMachine} from 'src/timeMachine/selectors'

// Types
import {AppState, AutoRefreshStatus, RemoteDataState} from 'src/types'

type ReduxProps = ConnectedProps<typeof connector>
type Props = ReduxProps

class TimeMachineRefreshDropdown extends PureComponent<Props> {
  private autoRefresher = new AutoRefresher()

  public componentDidMount() {
    const {autoRefresh} = this.props
    if (autoRefresh.status === AutoRefreshStatus.Active) {
      this.autoRefresher.poll(autoRefresh.interval)
    }

    this.autoRefresher.subscribe(this.executeQueries)
  }

  public componentDidUpdate(prevProps) {
    const {
      autoRefresh,
      onResetCancelBtnState,
      queryStatus,
      shouldShowCancelBtn,
    } = this.props
    if (
      queryStatus !== prevProps.queryStatus &&
      prevProps.queryStatus === RemoteDataState.Loading &&
      shouldShowCancelBtn
    ) {
      onResetCancelBtnState()
      clearCancelBtnTimeout()
    }

    if (!isEqual(autoRefresh, prevProps.autoRefresh)) {
      if (autoRefresh.status === AutoRefreshStatus.Active) {
        this.autoRefresher.poll(autoRefresh.interval)
        return
      }

      this.autoRefresher.stopPolling()
    }
  }

  public componentWillUnmount() {
    this.autoRefresher.unsubscribe(this.executeQueries)
    this.autoRefresher.stopPolling()
  }

  public render() {
    const {autoRefresh} = this.props

    return (
      <AutoRefreshDropdown
        selected={autoRefresh}
        onChoose={this.handleChooseAutoRefresh}
        onManualRefresh={this.executeQueries}
      />
    )
  }

  private handleChooseAutoRefresh = (interval: number) => {
    const {onSetAutoRefresh, autoRefresh} = this.props

    if (interval === 0) {
      onSetAutoRefresh({
        ...autoRefresh,
        status: AutoRefreshStatus.Paused,
        interval,
      })
      return
    }

    onSetAutoRefresh({
      ...autoRefresh,
      interval,
      status: AutoRefreshStatus.Active,
    })
  }

  private executeQueries = () => {
    event('RefreshQueryButton click')
    this.props.onSetCancelBtnTimer()
    this.props.onExecuteQueries()
  }
}

const mstp = (state: AppState) => {
  const shouldShowCancelBtn = shouldShowCancelBtnSelector(state)
  const queryStatus = getActiveTimeMachine(state).queryResults.status
  const {autoRefresh} = getActiveTimeMachine(state)

  return {autoRefresh, queryStatus, shouldShowCancelBtn}
}

const mdtp = {
  onExecuteQueries: executeQueries,
  onResetCancelBtnState: resetCancelBtnState,
  onSetCancelBtnTimer: delayEnableCancelBtn,
  onSetAutoRefresh: setAutoRefresh,
}

const connector = connect(mstp, mdtp)

export default connector(TimeMachineRefreshDropdown)

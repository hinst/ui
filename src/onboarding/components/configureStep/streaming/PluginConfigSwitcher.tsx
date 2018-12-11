// Libraries
import React, {PureComponent} from 'react'
import _ from 'lodash'

// Components
import PluginConfigForm from 'src/onboarding/components/configureStep/streaming/PluginConfigForm'
import EmptyDataSourceState from 'src/onboarding/components/configureStep/EmptyDataSourceState'

// Utils
import {getConfigFields} from 'src/onboarding/utils/pluginConfigs'

// Actions
import {
  updateTelegrafPluginConfig,
  addConfigValue,
  removeConfigValue,
} from 'src/onboarding/actions/dataLoaders'

// Types
import {TelegrafPlugin} from 'src/types/v2/dataLoaders'

interface Props {
  telegrafPlugins: TelegrafPlugin[]
  onUpdateTelegrafPluginConfig: typeof updateTelegrafPluginConfig
  onAddConfigValue: typeof addConfigValue
  onRemoveConfigValue: typeof removeConfigValue
  currentIndex: number
  authToken: string
}

class PluginConfigSwitcher extends PureComponent<Props> {
  public render() {
    const {
      authToken,
      onUpdateTelegrafPluginConfig,
      onAddConfigValue,
      onRemoveConfigValue,
    } = this.props

    if (this.currentTelegrafPlugin) {
      return (
        <PluginConfigForm
          authToken={authToken}
          telegrafPlugin={this.currentTelegrafPlugin}
          onUpdateTelegrafPluginConfig={onUpdateTelegrafPluginConfig}
          configFields={this.configFields}
          onAddConfigValue={onAddConfigValue}
          onRemoveConfigValue={onRemoveConfigValue}
        />
      )
    }
    return <EmptyDataSourceState />
  }

  private get currentTelegrafPlugin(): TelegrafPlugin {
    const {currentIndex, telegrafPlugins} = this.props
    return _.get(telegrafPlugins, `${currentIndex}`, null)
  }

  private get configFields() {
    return getConfigFields(this.currentTelegrafPlugin.name)
  }
}

export default PluginConfigSwitcher

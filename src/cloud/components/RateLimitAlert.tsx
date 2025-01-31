// Libraries
import React, {FC} from 'react'
import {connect} from 'react-redux'
import classnames from 'classnames'

// Components
import {
  FlexBox,
  FlexDirection,
  AlignItems,
  ComponentSize,
  IconFont,
  Gradients,
  InfluxColors,
  BannerPanel,
} from '@influxdata/clockface'
import CloudUpgradeButton from 'src/shared/components/CloudUpgradeButton'

// Utils
import {
  extractRateLimitResources,
  extractRateLimitStatus,
} from 'src/cloud/utils/limits'

// Constants
import {CLOUD} from 'src/shared/constants'

// Types
import {AppState} from 'src/types'
import {LimitStatus} from 'src/cloud/actions/limits'
import RateLimitAlertContent from 'src/cloud/components/RateLimitAlertContent'
import WriteLimitAlertContent from 'src/cloud/components/WriteLimitAlertContent'
interface StateProps {
  resources: string[]
  status: LimitStatus
}
interface OwnProps {
  alertOnly?: boolean
  className?: string
}
type Props = StateProps & OwnProps

const RateLimitAlert: FC<Props> = ({
  status,
  alertOnly,
  className,
  resources,
}) => {
  const rateLimitAlertClass = classnames('rate-alert', {
    [`${className}`]: className,
  })

  if (CLOUD && status === LimitStatus.EXCEEDED) {
    return (
      <>
        {resources.includes('cardinality') ? (
          <FlexBox
            direction={FlexDirection.Column}
            alignItems={AlignItems.Center}
            margin={ComponentSize.Large}
            className={rateLimitAlertClass}
          >
            <BannerPanel
              size={ComponentSize.ExtraSmall}
              gradient={Gradients.PolarExpress}
              icon={IconFont.Cloud}
              hideMobileIcon={true}
              textColor={InfluxColors.Yeti}
            >
              <RateLimitAlertContent />
            </BannerPanel>
          </FlexBox>
        ) : null}
        {resources.includes('write') ? (
          <FlexBox
            direction={FlexDirection.Column}
            alignItems={AlignItems.Center}
            margin={ComponentSize.Large}
            className={rateLimitAlertClass}
          >
            <BannerPanel
              size={ComponentSize.ExtraSmall}
              gradient={Gradients.PolarExpress}
              icon={IconFont.Cloud}
              hideMobileIcon={true}
              textColor={InfluxColors.Yeti}
            >
              <WriteLimitAlertContent />
            </BannerPanel>
          </FlexBox>
        ) : null}
      </>
    )
  }

  if (CLOUD && !alertOnly) {
    return <CloudUpgradeButton className="upgrade-payg--button__header" />
  }

  return null
}

const mstp = (state: AppState) => {
  const {
    cloud: {limits},
  } = state

  const resources = extractRateLimitResources(limits)
  const status = extractRateLimitStatus(limits)
  return {
    status,
    resources,
  }
}

export default connect<StateProps>(mstp)(RateLimitAlert)

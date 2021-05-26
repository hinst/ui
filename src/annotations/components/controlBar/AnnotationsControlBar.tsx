// Libraries
import React, {FC} from 'react'
import {useDispatch, useSelector} from 'react-redux'

// Components
import {
  AlignItems,
  ComponentColor,
  ComponentSize,
  FlexBox,
  FlexBoxChild,
  FlexDirection,
  InfluxColors,
  InputLabel,
  InputToggleType,
  JustifyContent,
  SlideToggle,
  TextBlock,
  Toggle,
} from '@influxdata/clockface'
import ErrorBoundary from 'src/shared/components/ErrorBoundary'
import Toolbar from 'src/shared/components/toolbar/Toolbar'
import {
  setAnnotationsVisibility,
  setAnnotationsWriteMode,
} from 'src/annotations/actions/creators'

// Selectors
import {
  isWriteModeEnabled,
  selectAreAnnotationsVisible,
} from 'src/annotations/selectors'

// Utils
import {event} from 'src/cloud/utils/reporting'

export const AnnotationsControlBar: FC = () => {
  const annotationsAreVisible = useSelector(selectAreAnnotationsVisible)
  const inWriteMode = useSelector(isWriteModeEnabled)

  const dispatch = useDispatch()

  const changeWriteMode = () => {
    event('dashboard.annotations.change_write_mode.toggle', {
      newIsWriteModeEnabled: (!inWriteMode).toString(),
    })
    dispatch(setAnnotationsWriteMode(!inWriteMode))
  }

  const changeAnnotationVisibility = () => {
    event('dashboard.annotations.change_visibility_mode.toggle', {
      newAnnotationsAreVisible: (!annotationsAreVisible).toString(),
    })
    dispatch(setAnnotationsVisibility(!annotationsAreVisible))
  }

  return (
    <ErrorBoundary>
      <Toolbar
        testID="annotations-control-bar"
        justifyContent={JustifyContent.FlexEnd}
        margin={ComponentSize.Large}
      >
        <FlexBoxChild grow={0}>
          <TextBlock
            backgroundColor={InfluxColors.Obsidian}
            textColor={InfluxColors.Mist}
            text="*Currently, we only support annotations on Plots of type 'Graph' and 'Graph + Single Stat'"
          />
        </FlexBoxChild>
        <FlexBoxChild grow={1} />
        <FlexBoxChild grow={0}>
          <Toggle
            style={{marginRight: 15}}
            id="enable-annotation-visibility"
            type={InputToggleType.Checkbox}
            checked={annotationsAreVisible}
            onChange={changeAnnotationVisibility}
            color={ComponentColor.Primary}
            size={ComponentSize.ExtraSmall}
            testID="annotations-visibility-toggle"
          >
            <InputLabel htmlFor="enable-annotation-visibility">
              Show Annotations
            </InputLabel>
          </Toggle>
        </FlexBoxChild>
        <FlexBox
          direction={FlexDirection.Row}
          alignItems={AlignItems.Center}
          margin={ComponentSize.Medium}
          style={{
            border: '1px solid gray',
            padding: 7,
            borderRadius: 16,
            paddingLeft: 15,
            paddingRight: 10,
          }}
        >
          <InputLabel active={!inWriteMode}>Enable Zoom Mode</InputLabel>
          <SlideToggle
            id="enable-annotation-mode"
            active={inWriteMode}
            onChange={changeWriteMode}
            color={ComponentColor.Primary}
            size={ComponentSize.ExtraSmall}
            testID="annotations-write-mode-toggle"
          />
          <InputLabel active={inWriteMode}>
            Enable Annotation Write Mode
          </InputLabel>
        </FlexBox>
      </Toolbar>
    </ErrorBoundary>
  )
}

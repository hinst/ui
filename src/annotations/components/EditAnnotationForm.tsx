// Libraries
import React, {FC, useState} from 'react'
import {useDispatch} from 'react-redux'
import {
  Button,
  Columns,
  ComponentColor,
  ComponentStatus,
  Grid,
  Overlay,
} from '@influxdata/clockface'
import {AnnotationMessageInput} from 'src/annotations/components/annotationForm/AnnotationMessageInput'
import {AnnotationTimeInput} from 'src/annotations/components/annotationForm/AnnotationTimeInput'

// Constants
import {ANNOTATION_FORM_WIDTH} from 'src/annotations/constants'

// Actions
import {deleteAnnotations} from 'src/annotations/actions/thunks'

// Types
import {Annotation, EditAnnotation} from 'src/types'

// Utils
import {event} from 'src/cloud/utils/reporting'

// Style
import 'src/annotations/components/editAnnotationForm.scss'

// Notifications
import {
  deleteAnnotationFailed,
  deleteAnnotationSuccess,
} from 'src/shared/copy/notifications'
import {notify} from 'src/shared/actions/notifications'

interface Props {
  handleSubmit: (editedAnnotation: EditAnnotation) => void
  annotation: Annotation
  handleClose: () => void
}

export const EditAnnotationForm: FC<Props> = (props: Props) => {
  const [editedAnnotation, updateAnnotation] = useState<EditAnnotation>({
    id: props.annotation.id,
    message: props.annotation.message ?? '',
    startTime: new Date(props.annotation.startTime).toISOString(),
    endTime: new Date(props.annotation.endTime).toISOString(),
    stream: props.annotation.stream,
    summary: props.annotation.summary,
    type:
      props.annotation.startTime === props.annotation.endTime
        ? 'point'
        : 'range',
  })

  console.log('in edit form......ACK88-a', props)

  const dispatch = useDispatch()

  const isValidAnnotationForm = ({summary, startTime}): boolean => {
    return summary.length && startTime
  }

  const doUpdate = (obj: any) => {
    updateAnnotation(annotation => {
      return {
        ...annotation,
        ...obj,
      }
    })
  }

  const updateStartTime = (newStartTime: string) => {
    doUpdate({startTime: newStartTime})
  }

  const updateEndTime = (newTime: string) => {
    doUpdate({endTime: newTime})
  }

  const updateMessage = (newMessage: string) => {
    doUpdate({summary: newMessage})
  }

  const handleSubmit = () => {
    props.handleSubmit(editedAnnotation)
  }

  const handleKeyboardSubmit = () => {
    props.handleSubmit(editedAnnotation)
  }

  const handleDelete = () => {
    try {
      dispatch(deleteAnnotations(editedAnnotation))
      event('xyplot.annotations.delete_annotation.success')
      dispatch(notify(deleteAnnotationSuccess(editedAnnotation.message)))
      props.handleClose()
    } catch (err) {
      event('xyplot.annotations.delete_annotation.failure')
      dispatch(notify(deleteAnnotationFailed(err)))
    }
  }

  let endTimeSection = null
  if (editedAnnotation.type === 'range') {
    endTimeSection = (
      <AnnotationTimeInput
        onChange={updateEndTime}
        onSubmit={handleKeyboardSubmit}
        time={editedAnnotation.endTime}
        name="endTime"
        titleText="End Time (UTC)"
      />
    )
  }

  return (
    <Overlay.Container maxWidth={ANNOTATION_FORM_WIDTH}>
      <Overlay.Header
        title="Edit Annotation"
        onDismiss={props.handleClose}
        className="edit-annotation-head"
      />
      <Grid className="edit-annotation-grid">
        <Grid.Column widthSM={Columns.Twelve} widthXS={Columns.Twelve}>
          <AnnotationTimeInput
            onChange={updateStartTime}
            onSubmit={handleKeyboardSubmit}
            time={editedAnnotation.startTime}
            name="startTime"
          />
          {endTimeSection}
          <AnnotationMessageInput
            message={editedAnnotation.summary}
            onChange={updateMessage}
            onSubmit={handleKeyboardSubmit}
          />
        </Grid.Column>
      </Grid>
      <Overlay.Footer className="edit-annotation-form-footer">
        <Button
          text="Delete Annotation"
          onClick={handleDelete}
          color={ComponentColor.Danger}
          style={{marginRight: '15px'}}
          testID="delete-annotation-button"
        />
        <div className="edit-annotation-buttons">
          <Button
            text="Cancel"
            onClick={props.handleClose}
            color={ComponentColor.Default}
            className="edit-annotation-cancel"
            testID="edit-annotation-cancel-button"
          />
          <Button
            text="Save Changes"
            onClick={handleSubmit}
            color={ComponentColor.Primary}
            status={
              isValidAnnotationForm({
                startTime: editedAnnotation.startTime,
                summary: editedAnnotation.summary,
              })
                ? ComponentStatus.Default
                : ComponentStatus.Disabled
            }
            testID="edit-annotation-submit-button"
          />
        </div>
      </Overlay.Footer>
    </Overlay.Container>
  )
}

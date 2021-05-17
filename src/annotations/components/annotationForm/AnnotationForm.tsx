// Libraries
import React, {FC, FormEvent, useState} from 'react'

// Components
import {
  Overlay,
  Button,
  ComponentColor,
  Form,
  Grid,
  ButtonType,
  ComponentStatus,
} from '@influxdata/clockface'
import {AnnotationMessageInput} from 'src/annotations/components/annotationForm/AnnotationMessageInput'
import {AnnotationTimeInput} from 'src/annotations/components/annotationForm/AnnotationTimeInput'

// Constants
import {ANNOTATION_FORM_WIDTH} from 'src/annotations/constants'

interface Annotation {
  message: string
  startTime: number | string
}

type AnnotationType = 'point' | 'range'

interface Props {
  startTime: string
  endTime?: string
  title: 'Edit' | 'Add'
  type: AnnotationType
  onSubmit: (Annotation) => void
  onClose: () => void
}

export const AnnotationForm: FC<Props> = (props: Props) => {
  const [startTime, setStartTime] = useState(props.startTime)
  const [endTime, setEndTime] = useState(props.endTime)
  const [message, setMessage] = useState('')

  console.log('foo-42a: here in annotation form; props??', props)

  const isValidAnnotationForm = ({message, startTime, endTime}): boolean => {
    const firstPart = message.length && startTime

    // TODO:  check that startTime is BEFORE endTime
    if (props.type === 'range') {
      return firstPart && endTime
    }
    return firstPart
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    props.onSubmit({message, startTime})
  }

  const updateMessage = (newMessage: string): void => {
    setMessage(newMessage)
  }

  const updateStartTime = (newTime: string): void => {
    setStartTime(newTime)
  }

  const updateEndTime = (newTime: string): void => {
    setEndTime(newTime)
  }

  const handleKeyboardSubmit = () => {
    props.onSubmit({message, startTime, endTime})
  }

  let endTimeSection = null
  if (props.type === 'range') {
    endTimeSection = (
      <Grid.Row>
        <AnnotationTimeInput
          onChange={updateEndTime}
          onSubmit={handleKeyboardSubmit}
          time={endTime}
          name="endTime"
        />
      </Grid.Row>
    )
  }
  return (
    <Overlay.Container maxWidth={ANNOTATION_FORM_WIDTH}>
      <Overlay.Header
        title={`${props.title} Annotation`}
        onDismiss={props.onClose}
      />
      <Form onSubmit={handleSubmit}>
        <Overlay.Body>
          <Grid>
            <Grid.Row>
              <AnnotationTimeInput
                onChange={updateStartTime}
                onSubmit={handleKeyboardSubmit}
                time={startTime}
                name="startTime"
              />
            </Grid.Row>
            {endTimeSection}
            <Grid.Row>
              <AnnotationMessageInput
                message={message}
                onChange={updateMessage}
                onSubmit={handleKeyboardSubmit}
              />
            </Grid.Row>
          </Grid>
        </Overlay.Body>
        <Overlay.Footer>
          <Button text="Cancel" onClick={props.onClose} />
          <Button
            text="Save Annotation"
            color={ComponentColor.Primary}
            type={ButtonType.Submit}
            status={
              isValidAnnotationForm({startTime, endTime, message})
                ? ComponentStatus.Default
                : ComponentStatus.Disabled
            }
            testID="add-annotation-submit"
          />
        </Overlay.Footer>
      </Form>
    </Overlay.Container>
  )
}

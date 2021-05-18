// Libraries
import React, {FC, ChangeEvent, KeyboardEvent, useState} from 'react'
import moment from 'moment'

// Components
import {
  Columns,
  ComponentStatus,
  Form,
  Grid,
  Input,
} from '@influxdata/clockface'

interface Props {
  onChange: (newTime: string) => void
  onSubmit: () => void
  time: string
  name: string
  titleText?: string
}

export const AnnotationTimeInput: FC<Props> = (props: Props) => {
  const [timeValue, setTimeValue] = useState<string>(
    moment(props.time).format('YYYY-MM-DD HH:mm:ss.SSS')
  )

  const isValidTimeFormat = (inputValue: string): boolean => {
    return moment(inputValue, 'YYYY-MM-DD HH:mm:ss.SSS', true).isValid()
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTimeValue(event.target.value)

    if (isValidTimeFormat(event.target.value)) {
      props.onChange(
        moment(event.target.value)
          .toDate()
          .toISOString()
      )
    }
  }

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      props.onSubmit()
      return
    }
  }

  const isValidInputValue = (inputValue: string): boolean => {
    if (inputValue === null) {
      return true
    }

    return isValidTimeFormat(inputValue)
  }

  const getInputValidationMessage = (): string => {
    if (!isValidInputValue(timeValue)) {
      return 'Format must be YYYY-MM-DD [HH:mm:ss.SSS]'
    }

    return ''
  }

  const validationMessage = getInputValidationMessage()

  const labelText = props.titleText ?? 'Start Time (UTC)'
  return (
    <Grid.Column widthXS={Columns.Twelve}>
      <Form.Element
        label={labelText}
        required={true}
        errorMessage={validationMessage}
      >
        <Input
          name={name}
          value={timeValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          status={ComponentStatus.Default}
        />
      </Form.Element>
    </Grid.Column>
  )
}

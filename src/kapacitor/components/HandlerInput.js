import React, {PropTypes} from 'react'
import _ from 'lodash'

const HandlerInput = ({
  fieldName,
  fieldDisplay,
  placeholder,
  selectedHandler,
  handleModifyHandler,
  redacted = false,
  disabled = false,
  fieldColumns = 'col-md-6',
  parseToArray = false,
}) => {
  const formGroupClass = `form-group ${fieldColumns}`
  return (
    <div className={formGroupClass}>
      <label htmlFor={fieldName}>
        {fieldDisplay}
      </label>
      <div className={redacted ? 'form-control-static redacted-handler' : null}>
        <input
          name={fieldName}
          id={fieldName}
          className="form-control input-sm form-malachite"
          type={redacted ? 'hidden' : 'text'}
          placeholder={placeholder}
          onChange={handleModifyHandler(
            selectedHandler,
            fieldName,
            parseToArray
          )}
          value={
            parseToArray
              ? _.join(selectedHandler[fieldName], ' ')
              : selectedHandler[fieldName]
          }
          autoComplete="off"
          spellCheck="false"
          disabled={disabled}
        />
        {redacted
          ? <span className="alert-value-set">
              <span className="icon checkmark" /> Value set in Config
            </span>
          : null}
      </div>
    </div>
  )
}

const {func, shape, string, bool} = PropTypes

HandlerInput.propTypes = {
  fieldName: string.isRequired,
  fieldDisplay: string,
  placeholder: string,
  disabled: bool,
  redacted: bool,
  selectedHandler: shape({}).isRequired,
  handleModifyHandler: func.isRequired,
  fieldColumns: string,
  parseToArray: bool,
}

export default HandlerInput

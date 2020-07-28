import React from 'react';

const FormInput = ({name, labelDisplay, value, onChangeFunc}) => (
  <div className="form-label-input">
    <label htmlFor={name}>{labelDisplay}:</label>
    <input name={name} value={value} onChange={onChangeFunc} />
  </div>
);

export default FormInput;

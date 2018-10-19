import React from 'react';
import PropTypes from 'prop-types';
import Errors from '../Errors/index';

class Input extends React.Component {
  render() {
    const {
      type, classStyle, name, value, placeholder, handleInputChange, disabled,
    } = this.props;

    return (
      <div>
        <input
          type={type}
          className={classStyle}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={handleInputChange}
          disabled={disabled}
          noValidate="novalidate"
        />
        {this.props.errors && this.props.errors[name] && <Errors errors={this.props.errors[name]} />}
      </div>
    );
  }
}

export default Input;
Input.propTypes = {
  classStyle: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  handleInputChange: PropTypes.func,
  disabled: PropTypes.bool,
  errors: PropTypes.any,
  type: PropTypes.any,
};

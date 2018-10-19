import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.Component {
  render() {
    const {
      type, value, name, onChange,
    } = this.props;

    return (
      <React.Fragment>
        <input
          {...this.props}
          type={type}
          value={value}
          name={name}
          onChange={onChange}
        />
      </React.Fragment>
    );
  }
}

export default Input;
Input.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

import React from 'react';
import PropTypes from 'prop-types';

class Checkbox extends React.Component {
  render() {
    const {
      type, value, name, onChange,
    } = this.props;

    return (
      <div className="checkbox">
        <input
          {...this.props}
          type={type}
          value={value}
          name={name}
          onChange={onChange}
          className="checkbox--white"
        />
        <span className="checkbox--marker" />
      </div>
    );
  }
}

export default Checkbox;
Checkbox.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

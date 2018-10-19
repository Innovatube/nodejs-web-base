import React from 'react';
import PropTypes from 'prop-types';

class Radio extends React.Component {
  render() {
    const {
      type, value, name, onChange,
    } = this.props;

    return (
      <div className="radio">
        <input
          {...this.props}
          type={type}
          value={value}
          name={name}
          onChange={onChange}
          className="radio--white"
        />
        <span className="radio--marker" />
      </div>
    );
  }
}

export default Radio;
Radio.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

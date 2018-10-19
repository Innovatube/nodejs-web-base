import React from 'react';
import PropTypes from 'prop-types';

const HomeIcon = ({ color }) => (
  <span
    className="step-circle"
    style={{
      background: color,
      color: 'white',
      border: 'none',
    }}
  ><i
    className="fas fa-home"
    style={{
      color: 'white',
    }}
  />
  </span>
);
HomeIcon.propTypes = {
  color: PropTypes.string,
};

export default HomeIcon;

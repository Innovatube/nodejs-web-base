import React from 'react';
import PropTypes from 'prop-types';

const HomeIcon = ({ color, index }) => (
  <span
    className="step-circle"
    style={{
      background: 'white',
      color,
      border: `1px solid ${color}`,
    }}
  >{index}
  </span>
);
HomeIcon.propTypes = {
  color: PropTypes.string,
  index: PropTypes.any,
};

export default HomeIcon;

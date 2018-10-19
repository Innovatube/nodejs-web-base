import React from 'react';
import PropTypes from 'prop-types';

const CenterLabel = props => (
  <div
    className={props.className}
    style={{
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <div>{props.title}</div>
  </div>
);

export default CenterLabel;
CenterLabel.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
};

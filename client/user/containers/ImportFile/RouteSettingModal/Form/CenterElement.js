import React from 'react';
import PropTypes from 'prop-types';

const CenterElement = props => (
  <div
    className={props.className}
    style={{
      display: 'flex',
      alignItems: 'center',
    }}
  >
    {props.children}
  </div>
);


export default CenterElement;
CenterElement.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

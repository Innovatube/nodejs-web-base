import React from 'react';
import PropTypes from 'prop-types';

const Success = (props) => {
  const { success } = props;
  if (success) {
    if (success.message) {
      return (
        <h3 style={{
          color: 'green',
          textAlign: 'center',
          fontSize: 15,
          display: 'block',
          margin: 0,
          paddingTop: 5,
        }}
        >{props.success.message}
        </h3>
      );
    }

    return success.map((s, index) => (
      <h3
        style={{
          color: 'center',
          textAlign: 'left',
          fontSize: 15,
          display: 'block',
          margin: 0,
          paddingTop: 5,
        }}
        key={index}
      > {s}
      </h3>
    ));
  }

  return <div />;
};

export default Success;
Success.propTypes = {
  success: PropTypes.any,
};

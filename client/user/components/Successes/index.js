import React from 'react';
import PropTypes from 'prop-types';

const Successes = (props) => {
  const { successes } = props;
  if (successes) {
    if (successes.message) {
      return (
        <h3 style={{
          color: 'green',
          textAlign: 'center',
          fontSize: 15,
          display: 'block',
          margin: 0,
          paddingTop: 5,
        }}
        >{props.successes.message}
        </h3>
      );
    }

    return successes.map((success, index) => (
      <h3
        style={{
          color: 'green',
          textAlign: 'left',
          fontSize: 15,
          display: 'block',
          margin: 0,
          paddingTop: 5,
          marginBottom: '1rem',
        }}
        key={index}
      > {success}
      </h3>
    ));
  }

  return <div />;
};

export default Successes;
Successes.propTypes = {
  successes: PropTypes.any,
};

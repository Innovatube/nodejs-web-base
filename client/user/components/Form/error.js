import React from 'react';
import PropTypes from 'prop-types';

const Errors = (props) => {
  const { errors } = props;
  if (errors) {
    if (errors.message) {
      return (
        <h3 style={{
          color: 'red',
          textAlign: 'center',
          fontSize: 15,
          display: 'block',
          margin: 0,
          paddingTop: 5,
        }}
        >{props.errors.message}
        </h3>
      );
    }

    return errors.map((err, index) => (
      <h3
        style={{
          color: 'red',
          textAlign: 'left',
          fontSize: 15,
          display: 'block',
          margin: 0,
          paddingTop: 5,
          marginBottom: '1rem',
        }}
        key={index}
      > {err}
      </h3>
    ));
  }

  return <div />;
};

export default Errors;
Errors.propTypes = {
  errors: PropTypes.any,
};

import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

const Errors = (props) => {
  const { errors, t } = props;
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
        >{t(props.errors.message)}
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
          marginBottom: '0.5rem',
        }}
        key={index}
      > {t(err, { defaultValue: err })}
      </h3>
    ));
  }

  return <div />;
};

export default translate('error')(Errors);
Errors.propTypes = {
  t: PropTypes.func,
  errors: PropTypes.any,
};

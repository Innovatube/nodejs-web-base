import React from 'react';
import PropTypes from 'prop-types';
import Errors from '../../../../components/Errors';

class Error extends React.Component {
  render() {
    const { errors } = this.props;

    return (
      <React.Fragment>
        <div className="col-5 col-sm-4" />
        <div className="col-7 col-sm-6">{errors && <Errors errors={errors} />}</div>
      </React.Fragment>
    );
  }
}

export default Error;

Error.propTypes = {
  errors: PropTypes.any,
};

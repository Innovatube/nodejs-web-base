import React from 'react';
import PropTypes from 'prop-types';

function redirect(location) {
  class RedirectRoute extends React.Component {
    constructor(props, context) {
      super(props, context);
      props.history.push(`/admin${location}`);
    }

    render() {
      return null;
    }
  }
  RedirectRoute.propTypes = {
    history: PropTypes.object.isRequired,
  };

  return RedirectRoute;
}

export default redirect;

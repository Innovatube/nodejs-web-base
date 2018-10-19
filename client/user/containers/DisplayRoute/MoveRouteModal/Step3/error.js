import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Alert } from 'reactstrap';

class Error extends React.Component {
  render() {
    const {
      t,
      data: {
        errorOverLoad,
        errorAllMoveOut,
        errorMoveUnserved,
      },
      error,
    } = this.props;

    return (errorOverLoad || errorAllMoveOut || error || errorMoveUnserved) && (
      <Alert color={(error || errorMoveUnserved) ? 'danger' : 'warning'}>
        {errorAllMoveOut && <p>{t('all_drops_will_be_moved_to_new_vehicle')}</p>}
        {errorOverLoad && <p>{t('vehicle_is_overloaded')}</p>}
        {error && <p>{t(error)}</p>}
        {errorMoveUnserved && <p>{t('user_cannot_move_a_stop_to_unserved_stop')}</p>}
      </Alert>
    );
  }
}
export default translate('error')(Error);
Error.propTypes = {
  data: PropTypes.object,
  error: PropTypes.string,
  t: PropTypes.func,
};

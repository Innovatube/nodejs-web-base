import React from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button,
} from 'reactstrap';
import format from 'string-template';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';


class EnforceChangePWModal extends React.Component {
  /**
   * Check if user have to change pw by force
   *
   * @return {boolean}
   */
  isEnforceChangePW = () => this.props.dayLeftToForceChangePW <= 0
      && localStorage.getItem('change_password_enforcement') === 'true';

  render() {
    const plural = this.props.dayLeftToForceChangePW > 1 ? 'days' : 'day';
    const { t } = this.props;
    const textAlert = this.isEnforceChangePW()
      ? `${t('your_password_expire_today')}`
      : format(t('your_password_will_expire_in'), {
        days: this.props.dayLeftToForceChangePW,
        plural,
      });

    const modalHeader = this.isEnforceChangePW()
      ? <ModalHeader className="alert__modal--header">{t('notice')}</ModalHeader>
      : <ModalHeader toggle={this.props.toggle} className="alert__modal--header">{t('notice')}</ModalHeader>;

    return (
      <Modal isOpen={this.props.modal} contentClassName="alert__modal" centered>
        {modalHeader}
        <ModalBody>
          <p>{textAlert}</p>
        </ModalBody>
        <ModalFooter className="alert__modal--footer">
          <Button onClick={this.props.onAgreeChangePW} className="submit-btn">{t('reset')}</Button>
          {!this.isEnforceChangePW()
            && (
              <Button onClick={this.props.toggle} className="cancel-btn">{t('cancel')}</Button>
            )
          }
        </ModalFooter>
      </Modal>
    );
  }
}
export default translate('error')(EnforceChangePWModal);
EnforceChangePWModal.propTypes = {
  toggle: PropTypes.func,
  modal: PropTypes.bool,
  onAgreeChangePW: PropTypes.func,
  dayLeftToForceChangePW: PropTypes.number,
  t: PropTypes.func,
};

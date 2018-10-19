import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { translate } from 'react-i18next';
import image from '../../../../user/image/logo.jpg';
import './style.css';


class AboutUsModal extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.toggle();
  }

  render() {
    const { t } = this.props;

    return (
      <div className="width">
        <Modal isOpen={this.props.modal} fade={false} toggle={this.toggle} centered>
          <ModalHeader toggle={this.toggle} className="modals_header">{t('about_us')}</ModalHeader>
          <ModalBody className="modals-body modals__background">
            <div className="logo">
              <img alt="logo" src={image} />
              <p>version 1.0.0</p>
            </div>
            <div className="text_about">
              <h5>TOYOTA TSUSHO NEXTY ELECTRONICS (THAILAND)</h5>
              <p>540. Mercury Tower 15-16 Floor Ploenchit Road.</p>
              <p>lumpini, Pathumwan, Bangkok 10330.</p>
              <p>Tel (+66) 26393500</p>
              <span>Email: <a href="mailto:support@squareroutes.net" className="email">support@squareroutes.net</a></span>
            </div>
          </ModalBody>
          <ModalFooter className="modals_footer modals__center">
            <Button color="aboutUs" onClick={this.toggle}>{t('close')}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default (translate('head')(AboutUsModal));
AboutUsModal.propTypes = {
  modal: PropTypes.bool,
  toggle: PropTypes.func,
  t: PropTypes.func,
};

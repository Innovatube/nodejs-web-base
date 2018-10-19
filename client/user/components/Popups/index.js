import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';


class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: true,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    const { errors, t } = this.props;

    return (
      <div>
        <Button color="danger" onClick={this.toggle} />
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{t('modal_title')}</ModalHeader>
          <ModalBody>
            {errors.message}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>{t('do_something')}</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>{t('cancel')}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default translate('errors')(Popup);
Popup.propTypes = {
  errors: PropTypes.object,
  t: PropTypes.func,
};

import React from 'react';
import {
  Modal, ModalBody, ModalHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import BlackButton from '../Buttons/BlackButton';
import './index.css';

const styles = {
  header: {
    color: 'white',
  },
  body: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white',
  },
  icon: {
    fontSize: 60,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 10,
  },
};

class ErrorDialog extends React.Component {
  render() {
    const isOpen = !!this.props.fleetError;
    const { t } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        contentClassName="error--dialog__display-route"
        centered
      >
        <ModalHeader>
          <b style={styles.header}>
            {t('error')}
          </b>
        </ModalHeader>
        <ModalBody>
          <div style={styles.body}>
            <i
              style={styles.icon}
              className="fas fa-exclamation-triangle"
            />
            {this.props.fleetError && <div><h4>{this.props.fleetError}</h4></div>}
            <p>{t('please_go_back_to_the_homepage')}</p>
            <BlackButton
              text="Home Page"
              onClick={() => {
                this.props.history.replace('/');
              }}
            />
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default withRouter(translate('error')(ErrorDialog));
ErrorDialog.propTypes = {
  history: PropTypes.object,
  fleetError: PropTypes.any,
  t: PropTypes.func,
};

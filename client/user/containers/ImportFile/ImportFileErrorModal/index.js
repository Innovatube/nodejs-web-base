import React from 'react';
import {
  Modal, ModalBody, ModalHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import BlackButton from '../../../components/Buttons/BlackButton';
import './index.css';
import importApi from '../../../../api/api-user.import';

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

class ImportFileErrorModal extends React.Component {
  onClick = () => {
    importApi.cancelSubmitRoute({
      task_id: this.props.jobId,
    });
    this.props.handleRouteSettingErrors(null);
    this.props.handleCancelRouteSetting();
    this.props.setProcessing(false);
    this.props.history.replace('/');
  }

  render() {
    const isOpen = this.props.errors && this.props.errors.error;
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
            <div><h4>{t('importing_errors')}</h4></div>
            <p>{t('please_go_back_to_the_homepage')}</p>
            <BlackButton
              text={t('back')}
              onClick={this.onClick}
            />
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default withRouter(translate('error')(ImportFileErrorModal));
ImportFileErrorModal.propTypes = {
  history: PropTypes.object,
  errors: PropTypes.object,
  handleRouteSettingErrors: PropTypes.func,
  handleCancelRouteSetting: PropTypes.func,
  setProcessing: PropTypes.func,
  jobId: PropTypes.number,
  t: PropTypes.func,
};

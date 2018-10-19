import React from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Input from '../../../../components/Input';
import authApi from '../../../../../api/api-user.auth';
import Errors from '../../../../components/Errors';
import '../style.css';

class ChangePWModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirm_password: '',
      errors: null,
      submitting: false,
    };
  }

  /**
   * Send API force change password
   *
   * @return {Promise<void>}
   */
  forceChangePassword = async () => {
    const data = this.state;

    const result = await authApi.forceChangePassword({
      password: data.password,
      confirm_password: data.confirm_password,
    });

    this.setState({ submitting: true, errors: null });

    if (result.error && result.message) {
      this.setState({ submitting: false, errors: result.data });

      return;
    }

    this.setState({ submitting: false, errors: null }, () => {
      localStorage.setItem('time_need_change_password', result.data.time_need_change_password);
      localStorage.setItem('change_password_enforcement', result.data.change_password_enforcement);
      this.props.toggle();
    });
  }

  render() {
    const { submitting, errors } = this.state;
    const { t } = this.props;
    const bind = statePath => ({
      value: this.state[statePath],
      handleInputChange: e => this.setState({ [statePath]: e.target.value }),
    });

    return (
      <Modal isOpen={this.props.modal} contentClassName="change-pw__modal" centered>
        <ModalHeader className="change-pw__modal--header">{t('reset_password')}</ModalHeader>
        <ModalBody>
          <p>{t('please_choose_a_new_password_for_this_user_account')}</p>
          <form className="change-pw__form">
            <div className="form-group">
              <Input
                type="password"
                classStyle="form-control"
                name="password"
                {...bind('password')}
                disabled={submitting}
                placeholder={t('new_password')}
                errors={errors}
              />
            </div>
            <div className="form-group">
              <Input
                type="password"
                {...bind('confirm_password')}
                classStyle="form-control"
                name="confirm_password"
                disabled={submitting}
                placeholder={t('confirm_new_password')}
                errors={errors}
              />
            </div>
            {errors && errors.message && <Errors errors={errors} />}
          </form>
        </ModalBody>
        <ModalFooter
          className="route-setting__modal--footer"
          style={{
            display: 'flex',
            'justify-content': 'center',
          }}
        >
          <Button onClick={this.forceChangePassword} className="submit-btn">{t('ok')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
export default translate('error')(ChangePWModal);
ChangePWModal.propTypes = {
  toggle: PropTypes.func,
  modal: PropTypes.bool,
  t: PropTypes.func,
};

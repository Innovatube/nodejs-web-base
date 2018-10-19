import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Input from '../../../components/Input';
import './style.css';

class ChangePassword extends React.Component {
  render() {
    const { t } = this.props;
    const listOfInput = [{
      name: 'currentPassword',
      type: 'password',
      placeholder: t('current_password'),
      value: this.props.value.currentPassword,
      handleInputChange: this.props.editTempInput('currentPassword'),
    }, {
      name: 'newPassword',
      type: 'password',
      placeholder: t('new_password'),
      value: this.props.value.newPassword,
      handleInputChange: this.props.editTempInput('newPassword'),
    }, {
      name: 'confirmPassword',
      type: 'password',
      placeholder: t('confirm_new_password'),
      value: this.props.value.confirmPassword,
      handleInputChange: this.props.editTempInput('confirmPassword'),
    }];
    const { errors } = this.props;

    return (
      <div>
        {listOfInput.map((input, key) => (
          <React.Fragment key={key}>
            <Input
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              noValidate="novalidate"
              errors={errors}
              handleInputChange={input.handleInputChange}
              value={input.value}
              classStyle="change_password__input"
            />
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export default (translate('dashboardContent')(ChangePassword));

ChangePassword.propTypes = {
  errors: PropTypes.object,
  editTempInput: PropTypes.func,
  value: PropTypes.object,
  t: PropTypes.func,
};

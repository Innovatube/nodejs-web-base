import React from 'react';
import {
  Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import importApi from '../../../../api/api-user.import';
import Errors from '../../../components/Errors';


class FilePasswordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPassword: false,
      file: '',
      password: '',
      mode: 'general',
      errors: null,
      uploading: false,
    };
    this.defaultState = {
      hasPassword: false,
      file: '',
      password: '',
      mode: 'general',
      errors: null,
      uploading: false,
    };
    this.handleUploadFile = this.handleUploadFile.bind(this);
  }

  handleInputChange = name => (e) => {
    if (name === 'file') {
      this.setState({
        file: e.target.files[0],
      });
    } else {
      this.setState({
        [name]: e.target.value,
      });
    }
  }

  toggleInput = () => {
    this.setState({
      hasPassword: !this.state.hasPassword,
    });
  }

  handleUploadFile = async () => {
    const errors = {};
    Object.keys({
      file: this.state.file,
      password: this.state.password,
      mode: this.state.mode,
    }).map((item) => {
      const error = this.validateConfig(item, this.state[item]);
      errors[item] = error;

      return item;
    });

    if (errors.file.length === 0 && errors.password.length === 0 && errors.mode.length === 0) {
      const info = {
        file: this.state.file,
        template_type: this.state.mode,
      };
      if (this.state.hasPassword && info.password !== '') {
        info.password = this.state.password;
      }
      const result = await importApi.upload(info);
      if (result.error) {
        this.setState({
          uploading: false,
          errors: {
            apiErrors: {
              message: result.error_code || result.message,
            },
          },
        });
      } else {
        this.props.upload({
          fileName: info.file.name,
          type: info.template_type,
          fileId: result.data.file_id,
          password: info.password || '',
        });
        this.setState(this.defaultState);
        this.props.toggle(true);
      }
    } else {
      this.setState({
        errors,
      });
    }
  }

  resetFile = () => {
    if (!this.props.uploading) {
      this.setState({
        file: '',
      });
    }
  }

  validateConfig = (type, data) => {
    const errors = [];
    const { t } = this.props;
    if (type === 'file') {
      if (data === '') {
        errors.push(t('file_can_not_be_empty'));
      }
    } else
    if (type === 'mode') {
      if (data === '') {
        errors.push(t('mode_can_not_be_empty'));
      }
    } else
    if (type === 'password' && this.state.hasPassword && data === '') {
      errors.push(t('password_can_not_be_empty'));
    }

    return errors;
  }

  toggleModal = () => {
    this.setState(this.defaultState);
    this.props.toggle();
  }

  render() {
    const { errors, uploading } = this.state;
    const { t } = this.props;

    return (
      <Modal isOpen={this.props.modal} contentClassName="file-password__modal" centered>
        <ModalHeader>{t('upload_file')}</ModalHeader>
        <ModalBody>
          <div className="file-password__modal--content">
            {(this.state.file === '') ? (
              <div className="import-file__button">
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept=".xlsx, .xls"
                  className="import-file__input"
                  onChange={this.handleInputChange('file')}
                  value={this.state.file}
                  disabled={uploading}
                />
                <div className="import-file__symbol">{t('file')}</div>
              </div>
            ) : <p className="file__name">{this.state.file.name} <i className="far fa-times-circle file__icon--cancel" onClick={this.resetFile} /></p>}
            {this.state.errors && this.state.errors.file && <Errors errors={this.state.errors.file} />}
          </div>
          <div className="file-password__modal--content" id="password_alert">
            <p><input disabled={uploading} type="checkbox" checked={this.state.hasPassword} onChange={this.toggleInput} />  <b>{t('password_alert_label')}</b></p>
            {this.state.hasPassword && <input disabled={uploading} className="form-control file-password__input" type="password" name="password" placeholder={t('password')} value={this.state.password} onChange={this.handleInputChange('password')} />}
            {this.state.errors && this.state.errors.password && <Errors errors={this.state.errors.password} />}
          </div>
          <div className="file-password__modal--content">
            <p id="file_mode"><b>{t('file_mode_label')}</b></p>
            <p id="general_mode"><input disabled={uploading} type="radio" name="mode" value="general" checked={this.state.mode === 'general'} onChange={this.handleInputChange('mode')} />  {t('general_mode_label')}</p>
            <p id="master_mode"><input disabled={uploading} type="radio" name="mode" value="master" checked={this.state.mode === 'master'} onChange={this.handleInputChange('mode')} />  {t('master_mode_label')}</p>
            {this.state.errors && this.state.errors.mode && <Errors errors={this.state.errors.mode} />}
          </div>
          <div>
            {
              errors && errors.apiErrors && <Errors errors={this.state.errors.apiErrors} />}
          </div>
        </ModalBody>
        <ModalFooter className="file-password__modal--footer">
          <button disabled={uploading} type="button" className="file-password__button btn-black" onClick={this.toggleModal}>{t('cancel')}</button>
          <button disabled={uploading} type="button" className="file-password__button" onClick={this.handleUploadFile}>{t('ok')}</button>
        </ModalFooter>
      </Modal>
    );
  }
}
export default (translate('upload')(FilePasswordModal));
FilePasswordModal.propTypes = {
  toggle: PropTypes.func,
  modal: PropTypes.bool,
  upload: PropTypes.func,
  uploading: PropTypes.bool,
  t: PropTypes.func,
};

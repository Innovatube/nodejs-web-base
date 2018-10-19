import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Header from '../../components/Header/index';
import profileApi from '../../../api/api-user.profile';
import Content from './Content';
import SideBar from './SideBar';
import './index.css';

class UserSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {
        email: '',
        fullName: '',
        company: '',
        role: '',
      },
      errors: null,
      submitting: false,
      isEditing: false,
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.setUserProfile = this.setUserProfile.bind(this);
  }

  componentDidMount() {
    this.getUserProfile();
  }

  setUserProfile = (data) => {
    this.setState({
      ...this.state,
      userProfile: {
        ...this.state.userProfile,
        email: data.data.user.email,
        fullName: data.data.user.name,
        company: data.data.user.company,
        file: data.data.user.file,
        role: this.checkRole(data.data.user.is_admin),
      },
    });
  }

  getUserProfile = async () => {
    const data = await profileApi.getUserProfile();
    if (data.error) {
      console.log(data.error);
    } else {
      this.setUserProfile(data);
    }
  }

  checkRole = (isAdmin) => {
    if (isAdmin) {
      return 'admin';
    }

    return 'ad_users';
  }

  updateUserProfile = async (info, onSuccess, onErrors) => {
    const data = await profileApi.updateUserProfile(info);
    if (data.error) {
      onErrors(data);
    } else {
      onSuccess();
      this.getUserProfile();
    }
  }

  toggleEditButton = () => {
    this.setState(prevState => ({
      isEditing: !prevState.isEditing,
    }));
  }

  async handleImageChange(dataUpdate, onCompleted) {
    const data = await profileApi.uploadAvatar(dataUpdate);
    if (!data.error) {
      await this.setUserProfile(data);
      onCompleted(data);
    } else {
      onCompleted(data);
    }
  }

  render() {
    const {
      errors, submitting, isEditing,
    } = this.state;
    const { t } = this.props;
    const groupInput = [{
      type: 'text',
      name: 'fullName',
      placeholder: t('full_name'),
      disabled: submitting,
      errors,
    }, {
      type: 'text',
      name: 'company',
      placeholder: t('ad_company'),
      disabled: submitting,
      errors,
    }, {
      type: 'text',
      name: 'email',
      placeholder: t('ad_email'),
      disabled: submitting,
      errors,
    }, {
      type: 'password',
      name: 'password',
      placeholder: t('password'),
      disabled: submitting,
      errors,
    }, {
      type: 'text',
      name: 'role',
      placeholder: t('role'),
      disabled: submitting,
      errors,
    }];

    return (
      <div className="user-setting">
        <Header
          {...this.props}
        />
        <div className="user-setting__section">
          <SideBar
            classStyle="user-setting__section--sidebar"
          />
          <Content
            groupInput={groupInput}
            classStyle="user-setting__section--content"
            isEditing={isEditing}
            toggleEditButton={this.toggleEditButton}
            userProfile={this.state.userProfile}
            updateUserProfile={this.updateUserProfile}
            handleImageChange={this.handleImageChange}
          />
        </div>
      </div>
    );
  }
}

export default (translate('dashboardContent')(UserSetting));
UserSetting.propTypes = {
  // history: PropTypes.object,
  t: PropTypes.func,
};

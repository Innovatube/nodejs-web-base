import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import {
  Row, Col, FormGroup,
} from 'reactstrap';
import Input from '../../../components/Input';
import Errors from '../../../components/Errors';
import Successes from '../../../components/Successes';
import ChangePassword from './ChagePassword';
import validate from '../validator';
import ImageInput from './ImageInput';
import image from './icon-lock.png';

const TIMEOUT_MESSAGE = 50000;

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: {
        password: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
      },
      errors: null,
      canEdit: {
        fullName: false,
        company: false,
        email: false,
        password: false,
        role: false,
      },
      isEditing: false,
      uploading: false,
      message: '',
      errorOnUpload: false,
    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      temp: {
        ...this.state.temp,
        ...nextProps.userProfile,
      },
    }, () => {
    });
  }

  editTempInput = name => (e) => {
    this.setState({
      ...this.state,
      temp: {
        ...this.state.temp,
        password: {
          ...this.state.temp.password,
          [name]: e.target.value,
        },
      },
    });
  }

  toggleEditIcon = (inputName) => {
    this.setState({
      ...this.state,
      canEdit: {
        ...this.state.canEdit,
        [inputName]: !this.state.canEdit[inputName],
      },
      isEditing: true,
    });
  }

  didUpdateUserProfile = (e) => {
    e.preventDefault();
    if (this.state.temp) {
      const validationResult = validate(this.state.temp.password);
      if (validationResult.currentPassword.length > 0 || validationResult.newPassword.length > 0 || validationResult.confirmPassword.length > 0) {
        this.setState({
          errors: validationResult,
        });
      } else {
        const onSuccess = () => {
          this.setState({
            temp: {
              ...this.state.temp,
              password: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              },
            },
            errors: null,
            isEditing: false,
            canEdit: {
              ...this.state.canEdit,
              password: false,
            },
          }, () => {
            this.props.toggleEditButton();
          });
        };
        const onErrors = (data) => {
          const errors = {};
          Object.keys(data.data).map((key) => {
            if (key === 'current_password') {
              errors.currentPassword = data.data.current_password;
            } else if (key === 'new_password') {
              errors.newPassword = data.data.new_password;
            } else if (key === 'confirm_new_password') {
              errors.confirmPassword = data.data.confirm_new_password;
            }
            this.setState({
              errors,
            });

            return key;
          });
        };
        this.props.updateUserProfile({
          current_password: this.state.temp.password.currentPassword,
          new_password: this.state.temp.password.newPassword,
          confirm_new_password: this.state.temp.password.confirmPassword,
        }, onSuccess, onErrors);
      }
    }
  }

  cancelUpdateUserProfile = (e) => {
    e.preventDefault();
    this.setState({
      temp: {
        ...this.state.temp,
        password: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
      },
      errors: null,
      isEditing: false,
      canEdit: {
        ...this.state.canEdit,
        password: false,
      },
    });
  }

  handleImageChange(key, data) {
    const dataUpdate = {};
    dataUpdate[key] = data;
    const onCompleted = (response) => {
      this.setState({
        ...this.state,
        message: response.message,
        errorOnUpload: response.error,
        uploading: false,
      });
      setTimeout(() => {
        this.setState({
          message: '',
          errorOnUpload: false,
        });
      }, TIMEOUT_MESSAGE);
    };
    this.setState({
      message: '',
      errorOnUpload: false,
      uploading: true,
    }, () => {
      this.props.handleImageChange(dataUpdate, onCompleted);
    });
  }

  render() {
    const { groupInput, classStyle, userProfile } = this.props;
    const { t } = this.props;
    const {
      errors,
      canEdit,
      isEditing,
      errorOnUpload,
      message,
      uploading,
    } = this.state;

    return (
      <div className={classStyle}>
        <div className="content__title"><p>{t('my_profile')}</p></div>
        <div className="content__section">
          <FormGroup row>
            <Row className="w-100">
              <ImageInput
                currentImageUrl={
                  (userProfile.profile_image) ? userProfile.profile_image
                    : (userProfile.file) ? userProfile.file.url : ''
                }
                name="upload_avatar"
                thumbnailSize={80}
                textPlaceholder={t('change')}
                uploading={uploading}
                onChange={e => this.handleImageChange('image', e.target.files[0])}
              />
            </Row>
            {
              (!errorOnUpload && message)
                ? (<Row className="w-100"><Col className="d-flex justify-content-center"><Successes successes={{ message }} /></Col></Row>)
                : ''
            }
            {
              (errorOnUpload && message)
                ? (<Row className="w-100"><Col className="d-flex justify-content-center"><Errors errors={{ message }} /></Col></Row>)
                : ''
            }
          </FormGroup>
          <div className="content__form" style={{ overflow: 'auto' }}>
            <form>
              {
                    groupInput.map((input, key) => (
                      <React.Fragment key={key}>
                        {canEdit[input.name] && (
                          <div>
                            <p style={{
                              color: 'white',
                              textAlign: 'left',
                              fontWeight: 'bold',
                            }}
                            >{input.placeholder}
                            </p>
                            {input.name === 'password'
                              ? (
                                <ChangePassword
                                  type={input.type}
                                  name={input.name}
                                  placeholder={input.placeholder}
                                  noValidate="novalidate"
                                  errors={errors}
                                  editTempInput={this.editTempInput}
                                  value={this.state.temp[input.name]}
                                />
                              )
                              : (
                                <Input
                                  type={input.type}
                                  name={input.name}
                                  placeholder={input.placeholder}
                                  noValidate="novalidate"
                                  errors={errors}
                                  handleInputChange={this.editTempInput}
                                  value={t(this.state.temp[input.name])}
                                />
                              )}
                          </div>
                        )}
                        {!canEdit[input.name] && (
                        <div style={{
                          display: 'flex',
                          width: '100%',
                          flexDirection: 'column',
                          borderTop: '1px solid grey',
                        }}
                        >
                          <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'nowrap',
                            padding: '10px 0px 0px 0px',
                            justifyContent: 'space-between',
                            textAlign: 'center',
                          }}
                          >
                            <p style={{
                              color: 'white',
                              textAlign: 'left',
                              fontWeight: 'bold',
                              width: '20%',
                            }}
                            >{input.placeholder}
                            </p>
                            {
                              input.name === 'password'
                                ? (
                                  <i
                                    className="fa fa-pen"
                                    style={{ color: 'white', width: 23, height: 23 }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (input.name === 'password') {
                                        this.toggleEditIcon(input.name);
                                      }
                                    }}
                                  />
                                ) : <img alt="icon" src={image} style={{ width: 23, height: 23 }} />
                            }
                          </div>
                          <p style={{
                            color: '#B8B8B8',
                            fontWeight: 'bold',
                            width: '40%',
                            paddingBottom: '10px',
                          }}
                          >{input.name === 'password' ? '**********' : t(this.props.userProfile[input.name])}
                          </p>
                        </div>
                        )}
                      </React.Fragment>
                    ))
                  }
              <div className="group-button">
                {isEditing && (
                <React.Fragment><button onClick={this.cancelUpdateUserProfile} className="group-button__item button--black" type="submit">{t('ad_cancel')}</button>
                  <button onClick={this.didUpdateUserProfile} className="group-button__item" type="button">{t('save')}</button>
                </React.Fragment>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default (translate('dashboardContent')(Content));
Content.propTypes = {
  groupInput: PropTypes.array,
  classStyle: PropTypes.string,
  userProfile: PropTypes.object,
  toggleEditButton: PropTypes.func,
  updateUserProfile: PropTypes.func,
  handleImageChange: PropTypes.func,
  t: PropTypes.func,
};

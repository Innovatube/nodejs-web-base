import React, { Component } from 'react';
import {
  Card, CardBody, CardHeader, Col, Row, Form, FormGroup, Input, Label, CardFooter, Button,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import UserRepository from '../../../repositories/UserRepository';
import ImageInput from './ImageInput';
import Errors from '../../../components/Errors';
import Success from '../../../components/Success';
import './edit.css';

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      user: {
        id: 0,
        name: '',
        email: '',
        password: '',
        is_admin: false,
        company: '',
        change_password_enforcement: false,
        password_expired_days: '',
        image: null,
        profile_image: '',
      },
      submited: false,
      errors: null,
      success: {},
    };
    this.setRepository = this.setRepository.bind(this);
    this.get = this.get.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.submit = this.submit.bind(this);
    this.setRepository();
  }

  componentWillMount() {
    this.setState({
      ...this.state,
      id: 0,
    });
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.get(id);
  }

  setRepository() {
    this.userRepository = new UserRepository();
  }

  async get(id) {
    if (isNaN(id)) {
      return;
    }
    const user = await this.userRepository.show(id);
    if (user.data) {
      this.setState({ ...this.state, id: id || 0, user: user.data });
      window.document.title = `Edit user ${user.data.email} - ${window.app.title}`;
    } else {
      this.setState({ ...this.state, id: 0 });
      window.document.title = `Create new user - ${window.app.title}`;
    }
  }

  handleDataChange(key, data) {
    const { user } = this.state;
    user[key] = data;
    this.setState({
      ...this.state,
      user: user || {},
    });
  }

  handleImageChange(key, keyDataUrl, data) {
    const { user } = this.state;
    const reader = new FileReader();
    reader.onloadend = () => {
      user[key] = data;
      user[keyDataUrl] = reader.result;
      this.setState({
        ...this.state,
        user: user || {},
      });
    };
    reader.readAsDataURL(data);
  }

  handleOptionChange(key, data) {
    const { user } = this.state;
    user[key] = data === 'true';
    this.setState({
      ...this.state,
      user: user || {},
    });
  }

  async submit(e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      submited: true,
      errors: null,
      success: {},
    });
    const { user } = this.state;
    delete user.profile_image;
    let userResult = {};
    if (this.state.id !== 0) {
      userResult = await this.userRepository.update(this.state.id, this.state.user);
    } else {
      userResult = await this.userRepository.store(this.state.user);
    }
    this.setState({
      ...this.state,
      submited: false,
    });
    if (userResult.error) {
      this.setState({
        ...this.state,
        errors: userResult,
      });
    } else {
      const success = (this.state.id !== 0) ? 'Update user success' : 'Create user success';
      this.setState({
        ...this.state,
        success: {
          message: success,
        },
      });
      if (this.state.id !== 0) {
        this.get(userResult.data.id);
      }
    }
  }

  render() {
    const { t } = this.props;
    const buttonSubmit = (this.state.id !== 0)
      ? (<Button type="submit" size="sm" color="primary"><i className="fa fa-pen" /> {t('update')}</Button>)
      : (<Button type="submit" size="sm" color="primary"><i className="fa fa-plus" /> {t('create')}</Button>);
    const buttonState = (this.state.submited)
      ? (<Button type="button" disabled size="sm" color="primary"><i className="fa fa-spinner fa-spin" /> {t('loading')}</Button>)
      : buttonSubmit;
    const { errors, success, user } = this.state;

    return (
      <div className="animated fadeIn">
        <Row className="edit-user">
          <Col xl={12}>
            <Card>
              <Form action="" onSubmit={this.submit} method="post" className="form-horizontal">
                <CardHeader>
                  { (this.state.id !== 0)
                    ? (<span><i className="fa fa-pen" /> {t('edit_user')}</span>)
                    : (<span><i className="fa fa-plus" /> {t('new_user')}</span>)
                  }
                </CardHeader>
                <CardBody className="p-4 bg-card-gray">
                  <FormGroup row>
                    <Col className="w-100">
                      <ImageInput
                        currentImageUrl={
                          (user.profile_image) ? user.profile_image
                            : (user.file) ? user.file.url : ''
                        }
                        name="upload_avatar"
                        thumbnailSize={80}
                        textPlaceholder={(this.state.id !== 0) ? t('change') : t('choose')}
                        onChange={e => this.handleImageChange('image', 'profile_image', e.target.files[0])}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col sm={{ size: 6, offset: 3 }}>
                      <Input
                        type="text"
                        placeholder={t('full_name')}
                        id="name"
                        name="name"
                        onChange={e => this.handleDataChange('name', e.target.value)}
                        value={user.name || ''}
                      />
                    </Col>
                  </FormGroup>
                  {errors && errors.data && errors.data.name && (
                  <div>
                    <Row>
                      <Col sm={{ size: 6, offset: 3 }}><Errors errors={errors.data.name} /></Col>
                    </Row>
                    <Row />
                  </div>
                  )}
                  <FormGroup row>
                    <Col sm={{ size: 6, offset: 3 }}>
                      <Input
                        type="text"
                        placeholder={t('ad_email')}
                        id="email"
                        name="email"
                        onChange={e => this.handleDataChange('email', e.target.value)}
                        value={user.email || ''}
                      />
                    </Col>
                  </FormGroup>
                  {errors && errors.data && errors.data.email && (
                  <div><Row><Col sm={{ size: 6, offset: 3 }}><Errors errors={[errors.data.email[0]]} /></Col></Row><Row /></div>
                  )}
                  <FormGroup row>
                    <Col sm={{ size: 6, offset: 3 }}>
                      <Input
                        type="password"
                        placeholder={t('password')}
                        id="password"
                        name="password"
                        onChange={e => this.handleDataChange('password', e.target.value)}
                      />
                    </Col>
                  </FormGroup>
                  {errors && errors.data && errors.data.password && (
                  <div><Row><Col sm={{ size: 6, offset: 3 }}><Errors errors={errors.data.password} /></Col></Row><Row /></div>
                  )}
                  <FormGroup row>
                    <Col sm={{ size: 6, offset: 3 }}>
                      <Input
                        type="text"
                        placeholder={t('ad_company')}
                        id="company"
                        name="company"
                        onChange={e => this.handleDataChange('company', e.target.value)}
                        value={user.company || ''}
                      />
                    </Col>
                  </FormGroup>
                  {errors && errors.data && errors.data.company && (
                  <div><Row><Col sm={{ size: 6, offset: 3 }}><Errors errors={[errors.data.company[0]]} /></Col></Row><Row /></div>
                  )}
                  <FormGroup row>
                    <Col sm={{ size: 6, offset: 3 }}>
                      <FormGroup check inline>
                        <Input
                          className="form-check-input"
                          type="radio"
                          id="is_admin_true"
                          name="is_admin"
                          checked={user && user.is_admin}
                          onChange={e => this.handleOptionChange('is_admin', e.target.value)}
                          value="true"
                        />
                        <Label className="form-check-label" check htmlFor="is_admin_true">{t('admin')}</Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input
                          className="form-check-input"
                          type="radio"
                          id="is_admin_false"
                          name="is_admin"
                          checked={!user || !user.is_admin}
                          onChange={e => this.handleOptionChange('is_admin', e.target.value)}
                          value="false"
                        />
                        <Label className="form-check-label" check htmlFor="is_admin_false">{t('ad_users')}</Label>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col sm={{ size: 6, offset: 3 }}>
                      <Input type="select" value={user.change_password_enforcement} name="change_password_enforcement" id="change_password_enforcement" onChange={e => this.handleDataChange('change_password_enforcement', e.target.value === 'true')}>
                        <option value="false">{t('change_password_no')}</option>
                        <option value="true">{t('change_password_yes')}</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  {errors && errors.data && errors.data.change_password_enforcement && (
                  <div><Row><Col sm={{ size: 6, offset: 3 }}><Errors errors={errors.data.change_password_enforcement} /></Col></Row><Row /></div>
                  )}
                  {this.state.user.change_password_enforcement
                  && (
                    <FormGroup row>
                      <Col sm={{ size: 6, offset: 3 }}>
                        <Input
                          placeholder={t('repeat_period')}
                          id="password_expired_days"
                          name="password_expired_days"
                          onChange={e => this.handleDataChange('password_expired_days', e.target.value)}
                          value={this.state.user.password_expired_days || ''}
                          required
                        />
                      </Col>
                    </FormGroup>
                  )
                  }
                  {errors && errors.data && errors.data.password_expired_days && (
                  <div><Row><Col sm={{ size: 6, offset: 3 }}><Errors errors={errors.data.password_expired_days} /></Col></Row><Row /></div>
                  )}
                </CardBody>
                <CardFooter>
                  {errors && errors.message && (<div><Row><Col sm={{ size: 6, offset: 3 }}><Errors errors={{ message: errors.error_code }} /></Col></Row><Row /></div>)}
                  {success && success.message && (<div><Row><Col sm={{ size: 6, offset: 3 }}><Success success={success} /></Col></Row><Row /></div>)}
                  <Row>
                    <Col sm={{ size: 6, offset: 5 }}>
                      <Button type="button" size="sm" color="danger" onClick={() => this.props.history.push('/admin/users')}><i className="fa fa-ban" />{t('ad_cancel')}</Button>
                      {' '}
                      {buttonState}
                    </Col>
                  </Row>
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default translate('dashboardContent')(EditUser);
EditUser.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object,
  t: PropTypes.func,
};

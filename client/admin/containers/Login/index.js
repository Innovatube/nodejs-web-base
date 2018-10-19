import React from 'react';
import PropTypes from 'prop-types';
import Input from '../../components/Input';
import './login.css';
import authApi from '../../../api/api-user.auth';
import { email, required } from '../../../user/components/Input/validator';
import validate from './validator';
import Errors from '../../components/Errors/index';

const validations = {
  email: {
    label: 'email',
    validations: [
      email,
      required,
    ],
  },
  password: {
    label: 'password',
    validations: [
      required,
    ],
  },
};

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: null,
      submitting: false,
      time_need_change_password: 0,
      change_password_enforcement: false,
    };
    this.login = this.login.bind(this);
  }

  goToForgotPassword = (e) => {
    e.preventDefault();
    this.props.history.push('/forgot-password');
  }

  async login(e) {
    e.preventDefault();
    const data = this.state;
    const validationResult = validate({
      email: data.email,
      password: data.password,
    });
    if (validationResult.email.length > 0 || validationResult.password.length > 0) {
      this.setState({
        errors: validationResult,
      });
    } else {
      this.setState({
        submitting: true,
        errors: null,
      });
      const result = await authApi.login({
        email: data.email,
        password: data.password,
      });
      if (result.error && result.message) {
        this.setState({
          submitting: false,
          errors: result,
        });
      } else {
        this.setState({
          submitting: false,
          errors: null,
          time_need_change_password: result.time_need_change_password,
        }, () => {
          localStorage.setItem('email', result.email);
          localStorage.setItem('token', result.token);
          localStorage.setItem('time_need_change_password', result.time_need_change_password);
          localStorage.setItem('change_password_enforcement', result.change_password_enforcement);
          localStorage.setItem('alert_show_once', false);
          this.props.history.push('/admin/dashboard');
        });
      }
    }
  }

  render() {
    const { submitting, errors } = this.state;
    const bind = statePath => ({
      value: this.state[statePath],
      handleInputChange: e => this.setState({ [statePath]: e.target.value }),
    });

    return (
      <div className="login">
        <div className="login__background">
          <img alt="background" src="https://snazzy-maps-cdn.azureedge.net/assets/1243-xxxxxxxxxxx.png?v=20170626083204" />
        </div>
        <form
          className="login__container"
        >
          <div className="login__form">
            <div className="form-group">
              <Input
                classStyle="form-control login__form--input"
                name="email"
                placeholder="Email"
                {...bind('email')}
                disabled={submitting}
                validation={validations.email}
                errors={errors}
              />
            </div>
            <div className="form-group">
              <Input
                type="password"
                classStyle="form-control login__form--input"
                name="password"
                placeholder="Password"
                {...bind('password')}
                disabled={submitting}
                validation={validations.password}
                errors={errors}
              />
            </div>
            {errors && errors.message && <Errors errors={errors} />}
            <button
              type="submit"
              className="btn btn-dark login__form--button"
              onClick={this.login}
              disabled={submitting}
            >LOGIN
            </button>
            <div
              className="login__forgotpassword"
              onClick={this.goToForgotPassword}
            >
              <p>Forgot Password ?</p>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

LoginPage.propTypes = {
  history: PropTypes.object,
};

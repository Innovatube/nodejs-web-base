import React from 'react';
import PropTypes from 'prop-types';
import Input from '../../components/Input';
import './login.css';
import authApi from '../../../api/api-user.auth';
import { email, required } from '../../components/Input/validator';
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

  goToRegister = (e) => {
    e.preventDefault();
    this.props.history.push('/register-now');
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
          this.props.history.push('/import-file');
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
          <img alt="background" src="https://cdn-images-1.medium.com/max/1600/1*yxyVk32O-W9gboC643Q15w.png" />
        </div>
        <form
          className="login__container"
        >
          <div className="justify-content-center row">
            <div className="col-md-8">
              <div className="card-group">
                <div className="p-4 card col-md-7">
                  <div className="card-body">
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <div className="form-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="icon-user" />
                        </span>
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
                    </div>
                    <div className="form-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="icon-lock" />
                        </span>
                        <Input
                          type="password"
                          classStyle="form-control login__form--input validation-color"
                          name="password"
                          placeholder="Password"
                          {...bind('password')}
                          disabled={submitting}
                          validation={validations.password}
                          errors={errors}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <button
                          type="submit"
                          className="btn px-4 btn-primary"
                          onClick={this.login}
                          disabled={submitting}
                        >LOGIN
                        </button>
                      </div>
                      <div className="text-right col-6">
                        <div
                          className="px-0 btn btn-link"
                          onClick={this.goToForgotPassword}
                        >
                          <p>Forgot Password ?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {errors && errors.message && <Errors errors={errors} />}
                </div>
                <div className="text-white bg-primary py-5 d-md-down-none card col-md-6">
                  <div className="text-center card-body">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                      <button
                        type="submit"
                        className="mt-3 btn btn-primary active"
                        onClick={this.goToRegister}
                        disabled={submitting}
                      >Register Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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

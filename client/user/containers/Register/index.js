import React from 'react';
import PropTypes from 'prop-types';
import Input from '../../components/Input';
import './register.css';
import authApi from '../../../api/api-user.auth';
import { email, required } from '../../components/Input/validator';
import validate from './validator';
import Errors from '../../components/Errors/index';

const validations = {
  name: {
    label: 'name',
    validations: [
      name,
    ],
  },
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
  cfpassword: {
    label: 'cfpassword',
    validations: [
      required,
    ],
  },
};

export default class CreatePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      cfpassword: '',
      errors: null,
      submitting: false,
      time_need_change_password: 0,
      change_password_enforcement: false,
    };
    this.create = this.create.bind(this);
  }

  async create(e) {
    e.preventDefault();
    const data = this.state;
    const validationResult = validate({
      name: data.name,
      email: data.email,
      password: data.password,
      cfpassword: data.cfpassword,
    });
    if (
      validationResult.name.length > 0 || validationResult.email.length > 0
      || validationResult.password.length > 0 || validationResult.cfpassword.length > 0) {
      this.setState({
        errors: validationResult,
      });
    } else {
      this.setState({
        submitting: true,
        errors: null,
      });
      const result = await authApi.create({
        name: data.name,
        email: data.email,
        password: data.password,
        cfpassword: data.cfpassword,
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
          localStorage.setItem('name', result.name);
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
            <div className="col-md-5">
              <div className="card-group">
                <div className="mx-4 card">
                  <div className="card-body">
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <div className="form-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="icon-user" />
                        </span>
                        <Input
                          classStyle="form-control login__form--input"
                          name="name"
                          placeholder="Username"
                          {...bind('name')}
                          disabled={submitting}
                          validation={validations.name}
                          errors={errors}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          @
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
                    <div className="form-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="icon-lock" />
                        </span>
                        <Input
                          type="password"
                          classStyle="form-control login__form--input validation-color"
                          name="cfpassword"
                          placeholder="Repeat Password"
                          {...bind('cfpassword')}
                          disabled={submitting}
                          validation={validations.cfpassword}
                          errors={errors}
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="btn btn-success btn-block"
                        onClick={this.create}
                        disabled={submitting}
                      > Create Account
                      </button>
                    </div>
                  </div>
                  {errors && errors.message && <Errors errors={errors} />}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

CreatePage.propTypes = {
  history: PropTypes.object,
};

import React from 'react';
import PropTypes from 'prop-types';
import './resetpassword.css';
import authApi from '../../../api/api-user.auth';
import Input from '../../components/Input';
import { validateResetPassword } from '../Login/validator';
import Errors from '../../components/Errors';

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVerified: true,
      password: '',
      errors: null,
      submitting: false,
      showSuccessMessage: false,
      confirmPassword: '',
    };
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    const { token } = this.props.match.params;
    authApi.verifyToken(token).then((data) => {
      if (data.error) {
        this.props.history.push('/login');
      } else {
        this.setState({
          isVerified: true,
        });
      }
    });
  }

  async submit(e) {
    e.preventDefault();
    const { password, confirmPassword } = this.state;
    const validationResult = validateResetPassword({ password, confirmPassword });
    if (validationResult.length > 0) {
      this.setState({
        errors: {
          password: validationResult,
        },
      });
    } else {
      this.setState({
        submitting: true,
        errors: null,
      });
      const data = await authApi.resetPassword({
        token: this.props.match.params.token,
        password,
        password_confirm: confirmPassword,
      });
      if (data.error) {
        this.setState({
          submitting: false,
          errors: data,
        });
      } else {
        this.setState({
          submitting: false,
          showSuccessMessage: true,
        });
      }
    }
  }

  render() {
    const { submitting, errors, isVerified } = this.state;
    const bind = statePath => ({
      value: this.state[statePath],
      handleInputChange: e => this.setState({ [statePath]: e.target.value }),
    });

    return (
      <div className="reset-password">
        {isVerified && (
        <React.Fragment>
          <div className="reset-password__background">
            <img alt="background" src="https://snazzy-maps-cdn.azureedge.net/assets/1243-xxxxxxxxxxx.png?v=20170626083204" />
          </div>
          <form className="reset-password__container" onSubmit={this.submit}>
            <div className="reset-password__form">
              {!this.state.showSuccessMessage && (
              <div>
                <h3
                  className="reset-password__title"
                >RESET PASSWORD
                </h3>
                <p
                  className="reset-password__paragraph--left"
                >Please choose a new password for this user account.
                </p>
                <div className="form-group">
                  <Input
                    classStyle="form-control reset-password__form--input"
                    name="email"
                    placeholder="New Password"
                    {...bind('password')}
                    disabled={submitting}
                    type="password"
                  />
                </div>
                <div className="form-group">
                  <Input
                    classStyle="form-control reset-password__form--input"
                    name="email"
                    placeholder="Confirm New Password"
                    {...bind('confirmPassword')}
                    disabled={submitting}
                    type="password"
                  />
                </div>
                {errors && errors.message && <Errors errors={errors} />}
                {errors && errors.password && <Errors errors={errors.password} />}
                <button
                  type="submit"
                  className="btn btn-dark reset-password__form--button"
                  onClick={this.submit}
                  disabled={submitting}
                >OK
                </button>
              </div>
              )}
              {this.state.showSuccessMessage && (
              <div>
                <h3
                  className="reset-password__title"
                >RESET PASSWORD
                </h3>
                <div
                  className="reset-password__message--success"
                >
                  <i
                    style={{
                      fontSize: 25,
                      marginRight: 10,
                    }}
                    className="fas fa-check-circle"
                  />
                  <h5 style={{
                    margin: 0,
                  }}
                  >Your password has been reset.
                  </h5>
                </div>
                <p className="reset-password__paragraph">
                  Please{' '}
                  <span
                    className="reset-password__link"
                    onClick={() => this.props.history.push('/login')}
                  >click here to log in
                  </span>
                </p>
              </div>
              )}
            </div>
          </form>
        </React.Fragment>
        )}
      </div>
    );
  }
}

ResetPassword.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
};

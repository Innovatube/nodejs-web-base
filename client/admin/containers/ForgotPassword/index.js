import React from 'react';
import PropTypes from 'prop-types';
import './forgotpassword.css';
import authApi from '../../../api/api-user.auth';
import Input from '../../components/Input';
import { validateEmail } from '../Login/validator';

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errors: null,
      submitting: false,
      showSuccessMessage: false,
    };
    this.submit = this.submit.bind(this);
  }

  async submit(e) {
    e.preventDefault();
    const { email } = this.state;
    const validationResult = validateEmail(email);
    if (validationResult.length > 0) {
      this.setState({
        errors: {
          email: validationResult,
        },
      });
    } else {
      this.setState({
        submitting: true,
        errors: null,
      });
      const data = await authApi.forgotPassword(email);
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
    const { submitting, errors } = this.state;
    const bind = statePath => ({
      value: this.state[statePath],
      handleInputChange: e => this.setState({ [statePath]: e.target.value }),
    });

    return (
      <div className="forgot-password">
        <div className="forgot-password__background">
          <img alt="background" src="https://snazzy-maps-cdn.azureedge.net/assets/1243-xxxxxxxxxxx.png?v=20170626083204" />
        </div>
        <form className="forgot-password__container" onSubmit={this.submit}>
          <div className="forgot-password__form">
            {!this.state.showSuccessMessage && (
            <div>
              <h3
                className="forgot-password__title"
              >FORGOT PASSWORD
              </h3>
              <p className="forgot-password__paragraph">Please enter the email address of your account. Check your email inbox, and click the link in the email you received to reset your password.
              </p>
              <div className="form-group">
                <Input
                  classStyle="form-control forgot-password__form--input"
                  name="email"
                  placeholder="Email Address"
                  {...bind('email')}
                  disabled={submitting}
                  errors={errors}
                />
              </div>
              <button
                type="submit"
                className="btn btn-light forgot-password__form--button"
                onClick={this.login}
                disabled={submitting}
              >Reset Password
              </button>
            </div>
            )}
            {this.state.showSuccessMessage && (
            <div>
              <h3 className="forgot-password__title">FORGOT PASSWORD
              </h3>
              <p className="forgot-password__paragraph">{`An email has been sent to your email address. Click the link in the email to reset your password.`}<br /><br />
                {`If you don't see the email, check junk, spam, or other folders.`}
              </p>
              <button
                type="submit"
                className="btn btn-light forgot-password__form--button"
                disabled={submitting}
                onClick={() => this.props.history.push('/login')}
              >OK
              </button>
            </div>
            )}
          </div>
        </form>
      </div>
    );
  }
}

ForgotPassword.propTypes = {
  history: PropTypes.object,
};

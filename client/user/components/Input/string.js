const string = {
  email: () => 'your_email_address_is_invalid_please_enter_a_valid_address',
  required: (name) => {
    switch (name) {
      case `email`:
        return `email_cannot_be_blank`;
      case 'password':
        return 'password_cannot_be_blank';
      case `currentPassword`:
        return `current_password_cannot_be_blank`;
      case `newPassword`:
        return `new_password_cannot_be_blank`;
      case `confirmPassword`:
        return `confirm_new_password_cannot_be_blank`;
      case `cfpassword`:
        return `password_cannot_be_blank`;

      case 'name':
        return 'name_cannot_be_blank';
      default:
        return `something_went_wrong`;
    }
  },
  confirmPassword: () => 'password_does_not_match_the_confirm_password',
  default: text => () => text,
};

export default string;

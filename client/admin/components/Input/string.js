const string = {
  email: () => 'Your email address is invalid. Please enter a valid address.',
  required: (name) => {
    switch (name) {
      case `email`:
        return `Email cannot be blank`;

      case `password`:
        return `New Password and Confirm New Password cannot be blank`;

      default:
        return `Something went wrong`;
    }
  },
  default: text => () => text,
};

export default string;

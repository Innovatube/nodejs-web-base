import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

class WhiteButton extends React.Component {
  render() {
    return (
      <button
        type="button"
        className="btn btn__white"
        onClick={this.props.onClick}
        {...this.props}
      >{this.props.text}
      </button>
    );
  }
}

WhiteButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
};

export default WhiteButton;

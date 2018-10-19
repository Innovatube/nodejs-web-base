import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

class BlackButton extends React.Component {
  render() {
    return (
      <button
        type="button"
        className="btn btn__black"
        onClick={this.props.onClick}
        {...this.props}
      >{this.props.text}
      </button>
    );
  }
}
export default BlackButton;
BlackButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  style: PropTypes.object,
};

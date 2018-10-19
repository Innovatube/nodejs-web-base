import React from 'react';
import PropTypes from 'prop-types';

class DateInput extends React.Component {
  render() {
    return (
      <div
        style={{
          padding: '.375rem .75rem',
          background: '#fff',
          color: '#5c6873',
          borderRadius: '0.25rem',
          border: '1px solid #e4e7ea',
        }}
        onClick={this.props.onClick}
      >
        <p
          style={{
            margin: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >{this.props.value }
          <i
            className="far fa-calendar-alt"
          />
        </p>
      </div>
    );
  }
}
DateInput.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.any,
};

export default DateInput;

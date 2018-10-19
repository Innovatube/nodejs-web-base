import React from 'react';
import PropTypes from 'prop-types';

const style = {
  width: 34,
  height: 25,
  background: '#062A30',
  color: 'white',
  marginBottom: 5,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 3,
};

class Toggle extends React.Component {
  render() {
    const { isOpenRouteDetail } = this.props;

    return (
      <div
        style={style}
        onClick={this.props.onClick}
      >
        {isOpenRouteDetail && (<i className="fas fa-angle-right" />)}
        {!isOpenRouteDetail && (<i className="fas fa-angle-left" />)}
      </div>
    );
  }
}

export default Toggle;
Toggle.propTypes = {
  onClick: PropTypes.func,
  isOpenRouteDetail: PropTypes.bool,
};

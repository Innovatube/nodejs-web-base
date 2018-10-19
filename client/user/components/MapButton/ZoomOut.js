import React from 'react';
import PropTypes from 'prop-types';
import { handleZoomOut } from '../Map/map';

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

class ZoomOut extends React.Component {
  render() {
    return (
      <div
        style={style}
        onClick={() => {
          handleZoomOut(this.props.map);
        }}
      ><i className="fas fa-minus" />
      </div>
    );
  }
}

export default ZoomOut;
ZoomOut.propTypes = {
  map: PropTypes.any,
};

import React from 'react';
import './index.css';

const defaultPosition = {
  lat: 13.78754,
  long: 100.601197,
};

class Map extends React.Component {
  componentDidMount() {
    this.initializeStaticMap();
  }


  initializeStaticMap = () => {
    const canvas = document.getElementById('map');
    const mapOptions = {
      center: this.createLatLong(defaultPosition),
      zoom: 12,
      disableDoubleClickZoom: true,
    };

    const map = new window.google.maps.Map(canvas, mapOptions);

    return map;
  }

  createLatLong = (position) => {
    if (position.lat && position.long && window.google) {
      return new window.google.maps.LatLng(position.lat, position.long);
    }

    return null;
  }

  render() {
    return (
      <div className="nexty__map">
        <div id="map" />
      </div>
    );
  }
}

export default Map;

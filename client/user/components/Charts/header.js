import React from 'react';
import PropTypes from 'prop-types';

class Header extends React.Component {
  componentDidMount() {
  }

  render() {
    const { header } = this.props;

    return (
      <div
        className="timeline-time"
        style={{
          width: header.length * 100,
        }}
      >
        {header.map((item, index) => <div key={index}>{item}</div>)}
      </div>
    );
  }
}

export default Header;

Header.propTypes = {
  header: PropTypes.array,
};

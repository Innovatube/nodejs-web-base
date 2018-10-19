import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: {
    overflow: 'hidden',
    display: 'flex',
  },
  content: {
    overflow: 'auto',
    paddingRight: 15,
    flex: 'auto',
  },
};

class ScrollView extends React.Component {
  render() {
    const { children, style, onScroll } = this.props;

    return (
      <div style={{ ...style, ...styles.container }}>
        <div style={styles.content} onScroll={onScroll}>
          {children}
        </div>
      </div>
    );
  }
}

export default ScrollView;
ScrollView.propTypes = {
  children: PropTypes.any,
  style: PropTypes.any,
  onScroll: PropTypes.any,
};

import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: isHidden => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    opacity: isHidden ? 0.2 : 1,
  }),
  bar: {
    backgroundColor: 'white',
    height: 6,
    width: 89,
    borderRadius: 3,
  },
  progress: (color, percentage) => ({
    backgroundColor: color,
    height: 6,
    width: Math.min(percentage, 100) * 69 / 100,
    borderRadius: 2,
  }),
  title: {
    color: 'white',
    width: 20,
    textAlign: 'center',
    fontSize: 12,
    marginRight: 30,
  },
};

class ProgressBar extends React.Component {
  color() {
    const { percentage } = this.props;
    if (percentage < 80) {
      return '#4dbd74';
    }
    if (percentage > 100) {
      return '#f86c6b';
    }

    return '#ffc107';
  }

  render() {
    const { percentage, title, isHidden } = this.props;

    return (
      <div style={styles.container(isHidden)}>
        {title && <span style={styles.title}>{title}</span> }
        <div style={styles.bar}>
          <div style={styles.progress(this.color(percentage), percentage || 0)} />
        </div>
      </div>
    );
  }
}

export default ProgressBar;
ProgressBar.propTypes = {
  percentage: PropTypes.number,
  title: PropTypes.string,
  isHidden: PropTypes.bool,
};

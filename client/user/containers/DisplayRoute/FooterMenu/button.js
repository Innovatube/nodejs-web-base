import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: {
    backgroundColor: '#333333',
    position: 'relative',
    height: 26,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderRadius: 4,
    marginRight: 8,
    cursor: 'pointer',
  },
  icon: {
    color: '#aaaaaa',
  },
  title: {
    marginLeft: 5,
    color: 'white',
  },
};

class Button extends React.Component {
  render() {
    const {
      title,
      icon,
      onClick,
      idButton,
    } = this.props;

    return (
      <div style={styles.container} id={idButton} onClick={onClick}>
        <i className={icon} style={styles.icon} />
        {title && (
          <span style={styles.title}>{title}</span>
        )}
      </div>
    );
  }
}

export default Button;
Button.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
  idButton: PropTypes.string,
};

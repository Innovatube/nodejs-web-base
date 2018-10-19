import React from 'react';
import Switch from 'react-switch';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

const styles = {
  container: {
    width: 104,
    height: 31,
    background: '#062A30',
    color: 'white',
    marginBottom: 5,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 3,
    justifyContent: 'space-between',
    padding: '0 5px 0 5px',
  },
  paragraph: {
    margin: 0,
    fontSize: 11,
  },
  switchText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    fontSize: 12,
    color: 'white',
    paddingRight: 2,
  },
};

class Traffic extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div style={{
        ...styles.container,
        ...this.props.style,
      }}
      >
        <p style={styles.paragraph}>{this.props.label}
        </p>
        <Switch
          checked={this.props.checked}
          onChange={this.props.onChange}
          uncheckedIcon={(
            <div
              style={styles.switchText}
            >
              {t('off')}
            </div>
          )}
          checkedIcon={(
            <div
              style={styles.switchText}
            >
              { t('on') }
            </div>
          )}
          className="react-switch"
          id="icon-switch"
          width={50}
          height={20}
        />
      </div>
    );
  }
}

export default translate('upload')(Traffic);

Traffic.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  style: PropTypes.object,
  label: PropTypes.string,
  t: PropTypes.func,
};

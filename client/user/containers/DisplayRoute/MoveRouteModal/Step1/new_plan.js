import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { ProgressBar } from '../../../../components/index';
import { addNewPlan } from '../../../../../actions/moveRoute';

const styles = {
  container: {
    minHeight: 40,
    backgroundColor: 'black',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginLeft: 8,
    marginRight: 8,
    color: 'green',
    fontSize: 13,
  },
  text: {
    color: 'white',
    fontSize: 13,
    width: 180,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rightContainer: {
    marginRight: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  kmText: {
    color: 'gray',
    fontSize: 13,
    marginRight: 15,
  },
  progressBarContainer: {
    height: 34,
    width: 89,
    justifyContent: 'space-evenly',
    display: 'flex',
    flexDirection: 'column',
  },
  progressBarTitle: {
    color: 'white',
    width: 45,
    textAlign: 'left',
    fontSize: 12,
    paddingLeft: 0,
  },
  progressBar: {
    backgroundColor: 'white',
    width: '0 0 89px',
    height: 6,
    flex: '0 0 100%',
  },
  progressBarWrapper: {
    width: 89,
  },
};


class RouteItem extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div style={styles.container} onClick={() => this.props.addNewPlan(this.props.vehicles)}>
        <div>
          <i className="fas fa-circle" style={styles.icon} />
          <span style={styles.text}>
            {t('new_route')}
          </span>
        </div>
        <div style={styles.rightContainer}>
          <span style={styles.kmText}>
            (0 {t('KM')})
          </span>
          <div>
            <ProgressBar
              percentage={0}
              left={t('volume')}
              leftTitleStyle={styles.progressBarTitle}
              progressStyle={styles.progressBar}
              wrapperStyle={styles.progressBarWrapper}
            />
            <ProgressBar
              percentage={0}
              left={t('weight')}
              leftTitleStyle={styles.progressBarTitle}
              progressStyle={styles.progressBar}
              wrapperStyle={styles.progressBarWrapper}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  vehicles: state.vehicles.data,
});

const mapDispatchToProps = dispatch => ({
  addNewPlan: vehicles => dispatch(addNewPlan(vehicles)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('moveModel')(RouteItem));
RouteItem.propTypes = {
  vehicles: PropTypes.array,
  addNewPlan: PropTypes.func,
  t: PropTypes.func,
};

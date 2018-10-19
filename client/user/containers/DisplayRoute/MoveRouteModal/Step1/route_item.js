import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Helper from '../../../../../helpers';
import { ProgressBar } from '../../../../components/index';
import { selectToPlan } from '../../../../../actions/moveRoute';

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
  icon: color => ({
    marginLeft: 8,
    marginRight: 8,
    color,
    fontSize: 13,
  }),
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
    const { plan, t } = this.props;

    return (
      <div style={styles.container} onClick={() => this.props.selectToPlan(plan)}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <i className="fas fa-circle" style={styles.icon(Helper.color.planColorWithId(this.props.state, plan.id))} />
          <div style={styles.text}>
            {plan.client_vehicle_id}
          </div>
        </div>
        <div style={styles.rightContainer}>
          <span style={styles.kmText}>
            ({parseInt(plan.total_distance / 1000, 10)} {t('KM')})
          </span>
          <div>
            {
              plan && plan.percentage_volume
              && (
              <ProgressBar
                percentage={plan.percentage_volume}
                left={t('volume')}
                leftTitleStyle={styles.progressBarTitle}
                progressStyle={styles.progressBar}
                wrapperStyle={styles.progressBarWrapper}
              />
              )
            }
            {
              plan && plan.percentage_weight && (
                <ProgressBar
                  percentage={plan.percentage_weight}
                  left={t('weight')}
                  leftTitleStyle={styles.progressBarTitle}
                  progressStyle={styles.progressBar}
                  wrapperStyle={styles.progressBarWrapper}
                />
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fleet: state.fleet,
  state,
});

const mapDispatchToProps = dispatch => ({
  selectToPlan: plan => dispatch(selectToPlan(plan)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('moveModel')(RouteItem));
RouteItem.propTypes = {
  plan: PropTypes.object,
  state: PropTypes.object,
  selectToPlan: PropTypes.func,
  t: PropTypes.func,
};

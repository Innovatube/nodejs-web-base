import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { ProgressBar } from '../../../../components/index';
import { format } from '../../../../util/date';
import { convertMeterToKilometer } from '../../../../util/distance';
import Box from '../../../../icon/box';
import Helper from '../../../../../helpers';

const Item = ({ icon, text, color }) => (
  <p className="fs-14" style={{ marginBottom: 0 }}>
    <i className={icon} style={{ color, paddingRight: 5 }} /> {text}
  </p>
);
Item.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
  color: PropTypes.string,
};

const ItemProgressBar = ({
  title, percentage, total1, total2,
}) => (
  <ProgressBar
    percentage={percentage}
    left={title}
    right={(total2 === `--` || total2 === null) ? `${total1.toFixed(1)}/ --` : `${total1.toFixed(1)}/${total2.toFixed(1)}`}
    rightTitleStyle={{
      width: 'auto',
    }}
    progressStyle={{
      flex: '0 0 60%',
    }}
  />
);
ItemProgressBar.propTypes = {
  title: PropTypes.string,
  percentage: PropTypes.number,
  total1: PropTypes.number,
  total2: PropTypes.any,
};

const styles = {
  container: {
    marginBottom: 8,
    border: '1px solid gray',
    borderRadius: 5,
    padding: 8,
    background: '#141818',
    wordWrap: 'break-word',
    color: 'white',
    fontSize: '14px',
    width: 220,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
};

class PlanDetailView extends React.Component {
  getSpeed = (route) => {
    const distance = convertMeterToKilometer(route.total_distance);
    const time = route.total_eta / 60;

    return Math.round(distance / time);
  }

  planIndex() {
    const { fleet, planId } = this.props;

    return fleet.plans.findIndex(plan => plan.id === planId);
  }

  plan() {
    const { fleet, planId } = this.props;

    return fleet.plans.find(plan => plan.id === planId);
  }

  vehicle() {
    const { vehicles, toPlan } = this.props;
    const plan = this.plan();
    if (plan) {
      return vehicles.find(vehicle => vehicle.client_vehicle_id === plan.client_vehicle_id);
    }

    return toPlan;
  }

  dropCount() {
    const { planData } = this.props;

    return planData.stops.length;
  }

  serviceTime() {
    const { planData, stops } = this.props;

    return planData.stops
      .map(stopId => stops.find(stop => stop.client_stop_id === stopId))
      .filter(stop => stop !== undefined)
      .map(stop => stop.service_time)
      .reduce((result, serviceTime) => result + serviceTime, 0);
  }

  sumVolume() {
    const { planData, stops } = this.props;

    return planData.stops
      .map(stopId => stops.find(stop => stop.client_stop_id === stopId))
      .filter(stop => stop !== undefined)
      .map(stop => stop.volume)
      .reduce((result, volume) => result + volume, 0);
  }

  sumWeight() {
    const { planData, stops } = this.props;

    return planData.stops
      .map(stopId => stops.find(stop => stop.client_stop_id === stopId))
      .filter(stop => stop !== undefined)
      .map(stop => stop.weight)
      .reduce((result, weight) => result + weight, 0);
  }

  renderTitle() {
    const { planId, t } = this.props;

    switch (planId) {
      case -2: return <h5>{t('new_route')}</h5>;
      case -1: return <h5>{t('unserved_stops')}</h5>;
      default: {
        const plan = this.plan();

        return <h5>{plan.client_vehicle_id}</h5>;
      }
    }
  }

  render() {
    const { fleet, t } = this.props;
    const plan = this.plan();
    const planIndex = this.planIndex();
    const color = Helper.color.planColor(planIndex, fleet.plans.length);


    return (
      <div style={styles.container}>
        {this.renderTitle()}
        <p className="fs-14" style={{ marginBottom: 0 }}>
          <Box style={{
            width: 20,
            height: 20,
            fill: color,
            paddingRight: 5,
          }}
          />
          {this.dropCount()} {t('drops_service_time')} {(this.serviceTime() / 60).toFixed(1)} {t('HR')})
        </p>
        <Item
          icon="far fa-clock w-20"
          text={plan ? `${format(plan.time_start)} - ${format(plan.time_end)}` : ` - `}
          color={color}
        />
        <div style={styles.row}>
          <Item
            icon="fas fa-truck w-20"
            text={plan ? `${convertMeterToKilometer(plan.total_distance)} ${t('KM')}` : `- ${t('KM')}`}
            color={color}
          />
          <Item
            icon="fas fa-tachometer-alt w-20"
            text={plan ? `${this.getSpeed(plan)} ${t('KM/HR')}` : `- ${t('KM/HR')}`}
            color={color}
          />
        </div>
        <ItemProgressBar
          title={t('v')}
          percentage={this.sumVolume() * 100 / this.vehicle().volume}
          total1={this.sumVolume()}
          total2={(this.vehicle().volume === undefined) ? `--` : this.vehicle().volume}
        />
        <ItemProgressBar
          title={t('w')}
          percentage={this.sumWeight() * 100 / this.vehicle().weight}
          total1={this.sumWeight()}
          total2={(this.vehicle().weight === undefined) ? `--` : this.vehicle().weight}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fleet: state.fleet.data,
  stops: state.stops.data,
  vehicles: state.vehicles.data,
  toPlan: state.moveRoute.toPlan,
});

export default connect(mapStateToProps)(translate('moveModel')(PlanDetailView));

PlanDetailView.propTypes = {
  fleet: PropTypes.object,
  toPlan: PropTypes.any,
  stops: PropTypes.array,
  planId: PropTypes.number,
  planData: PropTypes.object,
  vehicles: PropTypes.array,
  t: PropTypes.func,
};

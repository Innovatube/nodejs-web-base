import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { convertMeterToKilometer } from '../../../util/distance';
import HomeIcon from './elements/HomeIcon';
import NumberIcon from './elements/NumberIcon';

const styles = {
  header: {
    maxWidth: 100,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};

class Stepper extends React.Component {
  renderBody = props => (
    <React.Fragment>
      <div className="step-body" key={props.leg ? 'stepper-last' : 'stepper-first'}>
        <div>{props.leg && this.props.getCustomerName(props.leg)}</div>
      </div>
      {!props.isLast && (
      <div
        className="step-line"
        style={{
          background: props.color,
        }}
      />
      )}
    </React.Fragment>
  )

  renderHome = (props) => {
    const { color, leg, isLast } = props; //eslint-disable-line
    const { t } = this.props;

    return (
      <div className="step" key={props.index ? `stepper-home-${props.index}` : 'stepper-home'}>
        <div>
          <div className="step-item">
            <div className="step-container">
              <HomeIcon color={color} />
              <div className="step-header">
                <div>{leg && leg.stop_id ? leg.stop_id : t('start') }</div>
                <div>{leg && leg.distance ? `${convertMeterToKilometer(leg.distance)} ${t('KM')}` : `0${t('KM')}`}</div>
              </div>
            </div>

            {this.renderBody({
              color,
              leg,
              isLast,
            })}
          </div>
        </div>
      </div>
    );
  }


  render() {
    const {
      route, stop, getCustomerName, color,
    } = this.props;
    const { t } = this.props;

    return (
      <div className="step">
        {this.renderHome({ color })}
        {
          route.legs.map((leg, index) => { // eslint-disable-line

            if (index < route.legs.length) {
              return route.client_vehicle_id !== leg.stop_id ? (
                <div key={`stepper-${index}`}>
                  {
                    leg && stop && stop.length > 0 && (
                      <div className="step-item">
                        <div className="step-container">
                          <NumberIcon
                            color={color}
                            index={index + 1}
                          />
                          <div className="step-header">
                            <div style={styles.header}>{leg.stop_id}</div>
                            <div>{`${convertMeterToKilometer(leg.distance)} ${t('KM')}`}</div>
                          </div>
                        </div>
                        <div className="step-body">
                          <div>{getCustomerName(leg)}</div>
                        </div>
                        {index !== (route.legs.length - 1) && (
                        <div
                          className="step-line"
                          style={{
                            background: color,
                          }}
                        />
                        )}
                      </div>
                    )
                  }
                </div>
              ) : this.renderHome({
                color,
                leg,
                isLast: true,
              });
            }
          })
        }
      </div>
    );
  }
}

export default (translate('sidebar')(Stepper));
Stepper.propTypes = {
  route: PropTypes.object,
  stop: PropTypes.array,
  getCustomerName: PropTypes.func,
  color: PropTypes.any,
  t: PropTypes.func,
};

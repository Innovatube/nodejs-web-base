import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import moment from 'moment';
import { Popover, PopoverBody } from 'reactstrap';
import Helper from '../../../helper';
import constant from '../../../helper/constant';
import { convertMeterToKilometer } from '../../../../../../util/distance';

class HomeLabel extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showPopOver: false,
    };
  }


  styles() {
    const {
      leg,
      timeStart,
      color,
      isHidden,
    } = this.props;

    return {
      container: {
        width: 12,
        height: 26,
        position: 'absolute',
        left: Helper.time.leftPosition(moment(leg.arrive_time), timeStart) - 6,
        top: (constant.itemHeight - 26) / 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color,
        borderRadius: 3,
        color: 'white',
        opacity: isHidden ? 0.2 : 1,
        fontSize: 12,
      },
    };
  }

  show() {
    if (!this.state.showPopOver) {
      this.setState({
        showPopOver: true,
      });
    }
  }

  hide() {
    if (this.state.showPopOver) {
      this.setState({
        showPopOver: false,
      });
    }
  }

  stop() {
    const { leg, stops } = this.props;

    return stops && stops.find(stop => stop.client_stop_id === leg.stop_id);
  }

  render() {
    const { leg, t } = this.props;
    const stop = this.stop();

    return (
      <React.Fragment>
        <div
          id={`leg_${leg.id}`}
          data-tip={`leg_${leg.id}`}
          style={this.styles().container}
          onMouseEnter={() => this.show()}
          onMouseLeave={() => this.hide()}
          onMouseOut={() => this.hide()}
        />
        <Popover placement="right" isOpen={this.state.showPopOver} target={`leg_${leg.id}`} toggle={() => this.toggle()}>
          {stop && leg && (
          <PopoverBody>
            <h6>{leg.stop_id}</h6>
            <h6>{t('time')}: {moment(leg.arrive_time).format('HH:mm')}</h6>
            {stop.name}
            <br />
            {t('distance')}: {convertMeterToKilometer(leg.distance)} {t('KM')}
            <br />
            {t('speed')}: {parseInt(leg.distance / leg.eta / 1000 * 60, 10)} {t('KM/HR')}
          </PopoverBody>
          )}
        </Popover>
      </React.Fragment>
    );
  }
}

export default translate('timeline')(HomeLabel);
HomeLabel.propTypes = {
  leg: PropTypes.object,
  stops: PropTypes.array,
  timeStart: PropTypes.object,
  color: PropTypes.string,
  isHidden: PropTypes.bool,
  t: PropTypes.func,
};

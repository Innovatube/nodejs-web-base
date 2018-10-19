import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { ProgressBar } from '../../../components/index';
import DragAndDropToolTip from './Tooltip';


class Leg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false,
    };
    this.toggleToolTip = this.toggleToolTip.bind(this);
  }

  toggleToolTip(value) {
    return () => {
      if (value !== this.state.tooltipOpen) {
        this.setState(prev => ({
          tooltipOpen: value || !prev.tooltipOpen,
        }));
      }
    };
  }

  render() {
    const {
      color, leg, plan,
    } = this.props;
    const [fromVehicle] = this.props.vehicles.filter(vehicle => vehicle.client_vehicle_id === plan.client_vehicle_id);

    return (
      <Draggable draggableId={this.props.leg.id} index={this.props.index}>
        {provided => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div
              style={{
                marginBottom: 8,
                border: '1px solid lightgrey',
                borderRadius: 5,
                padding: 8,
                background: 'white',
                wordWrap: 'break-word',
                color: 'black',
                fontSize: '14px',
                display: 'flex',
                justifyContent: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onMouseOver={this.toggleToolTip(true)}
              onMouseOut={this.toggleToolTip(false)}
            >
              <span style={{
                border: `2px solid ${color}`,
                borderRadius: '50%',
                width: 25,
                height: 25,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
                color,
              }}
              >
                {leg.index + 1}
              </span>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 'auto',
              }}
              >
                <h4 className="resequence__p" style={{ maxWidth: 130 }}>{this.props.leg.content}</h4>
                <p className="resequence__p" id={`dragAndDrop-${this.props.index}`} style={{ maxWidth: 130 }}>{this.props.leg.customerName && this.props.leg.customerName}</p>
                {leg.volume !== null && (
                <ProgressBar
                  percentage={(leg.volume / fromVehicle.volume) * 100}
                  left="V"
                  right={leg.volume.toFixed(1)}
                  rightTitleStyle={{
                    width: 'auto',
                  }}
                />
                )}
                {leg.weight !== null && (
                <ProgressBar
                  percentage={(leg.weight / fromVehicle.weight) * 100}
                  left="W"
                  right={leg.weight.toFixed(1)}
                  rightTitleStyle={{
                    width: 'auto',
                  }}
                />
                )}
                <DragAndDropToolTip
                  target={`dragAndDrop-${this.props.index}`}
                  tooltipOpen={this.state.tooltipOpen}
                />
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }
}

export default Leg;
Leg.propTypes = {
  leg: PropTypes.object,
  index: PropTypes.number,
  color: PropTypes.string,
  plan: PropTypes.object,
  vehicles: PropTypes.array,
};

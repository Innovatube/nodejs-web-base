import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Column from './column';

class ReSequenceBody extends React.Component {
  render() {
    const { plan, color, vehicles } = this.props;
    const { t } = this.props;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
      }}
      >
        <div style={{
          flex: '0 0 85%',
        }}
        >
          <div>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  background: color,
                  borderRadius: '50%',
                }}
              /> {plan.client_vehicle_id}
            </div>
          </div>
          <div><p className="resequence__p">{t('drag_drop_to')} {t('re_sequence')}</p></div>
          {this.props.data && (
          <DragDropContext
            onDragEnd={this.props.onDragEnd}
          >
            {this.props.data && this.props.data.columnOrder.map((columnId) => {
              const column = this.props.data.columns[columnId];
              const legs = column.legIds.map(legId => this.props.data.legs[legId]);

              return (
                <Column
                  key={column.id}
                  column={column}
                  legs={legs}
                  color={color}
                  plan={plan}
                  vehicles={vehicles}
                />
              );
            })}
          </DragDropContext>
          )}
          <div>
            <input type="checkbox" checked={this.props.isAutoReRoute} onChange={this.props.toggleAutoReRoute} /> {t('auto_re_route')}
          </div>
        </div>
        <div style={{
          flex: '0 0 15%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <i
            className="fas fa-exchange-alt"
            style={{
              transform: 'rotate(90deg)',
            }}
          />
        </div>
      </div>
    );
  }
}

export default translate('resequence')(ReSequenceBody);
ReSequenceBody.propTypes = {
  data: PropTypes.object,
  plan: PropTypes.object,
  color: PropTypes.string,
  onDragEnd: PropTypes.func,
  vehicles: PropTypes.array,
  isAutoReRoute: PropTypes.bool,
  toggleAutoReRoute: PropTypes.func,
  t: PropTypes.func,
};

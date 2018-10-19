import React, { Component } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Stop from './stop';
import { moveStopToPlan } from '../../../../../actions/moveRoute';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  columnContainer: {
    height: 400,
    width: 220,
    overflow: 'auto',
    borderRadius: 10,
    backgroundColor: '#141818',
  },
  draggableContainer: {
    minHeight: 400,
    width: 220,
  },
};

class DragAndDropView extends Component {
  handleDragAndDrop(result) {
    if (!result.source || !result.destination) {
      return;
    }
    const stopId = result.draggableId;
    const seq = result.destination.index;
    const fromPlanId = result.source.droppableId;
    const toPlanId = result.destination.droppableId;
    this.props.moveStopToPlan(stopId, seq, fromPlanId, toPlanId);
  }

  render() {
    const { fromPlan, toPlan } = this.props;

    return (
      <div style={styles.container}>
        <DragDropContext onDragEnd={result => this.handleDragAndDrop(result)}>
          <div style={styles.columnContainer}>
            <Droppable droppableId={`${fromPlan.id}`} type="PERSON">
              {provided => (
                <div
                  ref={provided.innerRef}
                  style={styles.draggableContainer}
                  {...provided.droppableProps}
                >
                  {fromPlan.stops.map((stopId, index) => (
                    <Stop index={index} stopId={stopId} key={stopId} planId={fromPlan.id} />
                  ))}
                </div>
              )}
            </Droppable>
          </div>
          <i className="fas fa-exchange-alt" style={{ color: 'white' }} />
          <div style={styles.columnContainer}>
            <Droppable droppableId={`${toPlan.id}`} type="PERSON">
              {provided => (
                <div
                  ref={provided.innerRef}
                  style={styles.draggableContainer}
                  {...provided.droppableProps}
                >
                  {toPlan.stops.map((stopId, index) => (
                    <Stop index={index} stopId={stopId} key={stopId} planId={toPlan.id} />
                  ))}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fleet: state.fleet.data,
  stops: state.stops.data,
  fromPlan: state.moveRoute.fromPlan,
  toPlan: state.moveRoute.toPlan,
});

const mapDispatchToProps = dispatch => ({
  moveStopToPlan: (stopId, seq, fromPlanId, toPlanId) => dispatch(moveStopToPlan(stopId, seq, fromPlanId, toPlanId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DragAndDropView);
DragAndDropView.propTypes = {
  fleet: PropTypes.object,
  stops: PropTypes.array,
  moveStopToPlan: PropTypes.func,
  fromPlan: PropTypes.object,
  toPlan: PropTypes.object,
};

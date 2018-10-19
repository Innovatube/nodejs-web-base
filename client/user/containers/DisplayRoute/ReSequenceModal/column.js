import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import Leg from './leg';

const Container = props => (
  <div style={{
    marginTop: 5,
    marginBottom: 5,
    border: '1px solid lightgrey',
    borderRadius: 5,
  }}
  >{props.children}
  </div>
);
const Title = props => (
  <h3 style={{
    padding: 8,
  }}
  >{props.children}
  </h3>
);
const TaskList = props => (
  <div style={{
    padding: 8,
  }}
  >{props.children}
  </div>
);

class Column extends React.Component {
  render() {
    const { color, plan, vehicles } = this.props;

    return (
      <Container>
        <div>
          <div style={{
            marginBottom: 0,
            padding: '8px 8px 0px 8px',
          }}
          >
            <div style={{
              border: '1px solid lightgrey',
              borderRadius: 5,
              padding: 8,
              background: '#9EA19F',
              wordWrap: 'break-word',
              color: 'black',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'baseline',
              flexDirection: 'row',
            }}
            >
              <span style={{
                background: color,
                borderRadius: '50%',
                width: 25,
                height: 25,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}
              >
                <i
                  className="fas fa-home"
                  style={{
                    color: 'white',
                  }}
                />
              </span>
              <p className="resequence__p">
                Start
              </p>
            </div>
          </div>
        </div>
        <Droppable droppableId={this.props.column.id}>
          {
            provided => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  padding: 8,
                }}
              >
                {this.props.legs
            && this.props.legs.map((leg, index) => (
              <Leg
                key={leg.id}
                leg={leg}
                index={index}
                color={color}
                plan={plan}
                vehicles={vehicles}
              />
            ))}
              </div>
            )
          }
        </Droppable>
      </Container>
    );
  }
}

export default Column;
Column.propTypes = {
  legs: PropTypes.array,
  column: PropTypes.object,
  children: PropTypes.any,
  color: PropTypes.string,
  plan: PropTypes.object,
  vehicles: PropTypes.array,
};

Container.propTypes = {
  children: PropTypes.any,
};

Title.propTypes = {
  children: PropTypes.any,
};

TaskList.propTypes = {
  children: PropTypes.any,
};

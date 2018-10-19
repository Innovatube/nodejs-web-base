import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TimelineLine from './line';
import Helper from '../helper';
import { TimeBasis, UnservedLine } from './elements';
import constant from '../helper/constant';
import { ScrollView } from '../../../../components';

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  time_basis: {
    container: scrollLeft => ({
      flex: `0 0 ${constant.headerHeight}px`,
      marginLeft: 0 - scrollLeft,
    }),
  },
};

class Chart extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      scrollLeft: 0,
    };
  }

  onScroll(event) {
    const { scrollLeft } = event.target;
    this.setState({
      scrollLeft,
    });

    const { onScroll } = this.props;
    if (onScroll) {
      onScroll(event);
    }
  }

  render() {
    const {
      fleet,
    } = this.props;
    if (!fleet.plans) {
      return <div />;
    }

    return (
      <div style={styles.container}>
        <div style={styles.time_basis.container(this.state.scrollLeft)}>
          <TimeBasis />
        </div>
        <ScrollView style={{ overflow: 'auto', flex: 'auto' }} onScroll={event => this.onScroll(event)}>
          {(fleet && fleet.unserved && fleet.unserved.length > 0) && (
            <UnservedLine />
          )}
          {fleet.plans && fleet.plans.map((plan, index) => (
            <TimelineLine
              plan={plan}
              key={plan.id}
              color={Helper.color.pathColor(index, fleet.plans.length)}
            />
          ))}
        </ScrollView>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fleet: state.fleet.data,
});

export default connect(mapStateToProps)(Chart);
Chart.propTypes = {
  fleet: PropTypes.object,
  onScroll: PropTypes.func,
};

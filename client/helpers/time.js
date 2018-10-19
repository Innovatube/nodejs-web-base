import moment from 'moment-timezone';

moment.tz.setDefault('GMT');

const maxTime = (plans) => {
  if (plans) {
    const allEndTime = plans.map(plan => moment(plan.time_end));
    const max = moment.max(allEndTime);
    const roundUp = max.startOf('day').add(1, 'day').add(1, 'hour');

    return roundUp;
  }

  return false;
};

const minTime = (plans) => {
  if (plans) {
    const allStartTime = plans.map(plan => moment(plan.time_start));
    const min = moment.min(allStartTime);
    const roundDown = min.startOf('day').add(-1, 'hour');

    return roundDown;
  }

  return false;
};

const startTime = (plans) => {
  if (plans) {
    const allStartTime = plans.map(plan => moment(plan.time_start));
    const min = moment.min(allStartTime);

    return min;
  }

  return false;
};

const TimeHelper = {
  maxTime,
  minTime,
  startTime,
};
export default TimeHelper;

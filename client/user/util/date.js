import moment from 'moment';

export const format = (date, template = undefined) => {
  if (template) {
    return moment(date, template.moment).format(template.format);
  }

  return moment(date).format('HH:mm');
};

export const diff = (start, end) => {
  const duration = moment(start).diff(end, 'hours');

  return duration;
};

export const getTodayDate = () => moment().format('YYYY-MM-DD');

export const getDefaultDatePicker = () => moment();

export const getDuration = (route) => {
  const start = moment(format(route.time_start), 'HH:mm');
  const end = moment.utc(format(route.time_end), 'HH:mm');
  if (end.isBefore(start)) end.add(1, 'day');
  const d = moment.duration(end.diff(start));
  const time = moment.utc(+d).format('H:mm');

  return time;
};

export default {
  format,
  diff,
  getTodayDate,
  getDefaultDatePicker,
  getDuration,
};

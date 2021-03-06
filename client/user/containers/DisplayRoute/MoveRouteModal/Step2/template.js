import Validator from '../../../../components/Form/validation';

export default ({ vehicles, t }) => ({
  validators: [
    Validator.required(t)('clientVehicleId', t('route_id')),
    Validator.vehicleIDUnique(t)('clientVehicleId', vehicles.map(vehicle => vehicle.client_vehicle_id)),
    Validator.required(t)('lat_start', t('latitude_start')),
    Validator.required(t)('lng_start', t('longitude_start')),
    Validator.number(t)('lat_start', t('latitude_start')),
    Validator.number(t)('lng_start', t('longitude_start')),
    Validator.number(t)('lat_end', t('latitude_end')),
    Validator.number(t)('lng_end', t('longitude_end')),
    Validator.number(t)('speed_limit', t('speed_limit')),
    Validator.number(t)('volume', t('volume')),
    Validator.number(t)('weight', t('weight')),
    Validator.number(t)('time_to_leave', t('time_to_leave')),
    Validator.isIn(t)('type', t('vehicle_type'), [1, 2, 4, 8]),
    Validator.isIn(t)('priority', t('priority'), ['', 'high']),
    Validator.isIn(t)('reverse_delivery', 'Reverse Delivery', [0, 1]),
    Validator.isDateFormat(t)('time_start', t('time_start'), 'HH:mm:ss'),
    Validator.isDateFormat(t)('time_end', t('time_end'), 'HH:mm:ss'),
    Validator.isDateFormat(t)('break_time_start', t('break_time_start'), 'HH:mm:ss'),
    Validator.isDateFormat(t)('break_time_end', t('break_time_end'), 'HH:mm:ss'),
  ],
  elements: [
    {
      type: 'input-id',
      input_key: 'clientVehicleId',
      title: 'route_id',
      left_col: 3,
      right_col: 6,
    },
    {
      type: 'input-number',
      input_key: 'lat_start',
      title: 'lat_start',
      left_col: 3,
      right_col: 6,
    },
    {
      type: 'input-number',
      input_key: 'lng_start',
      title: 'lng_start',
      left_col: 3,
      right_col: 6,
    },
    {
      type: 'input-number',
      input_key: 'lat_end',
      title: 'lng_start',
      left_col: 3,
      right_col: 6,
    },
    {
      type: 'input-number',
      input_key: 'lng_end',
      title: 'lng_end',
      left_col: 3,
      right_col: 6,
    },
    {
      type: 'input',
      input_key: 'time_start',
      title: 'time_start',
      left_col: 6,
      right_col: 6,
      col: 6,
    },
    {
      type: 'input',
      input_key: 'time_end',
      title: 'time_end',
      left_col: 6,
      right_col: 6,
      col: 6,
    },
    {
      type: 'input-number',
      input_key: 'speed_limit',
      title: 'speed_limit',
      left_col: 3,
      right_col: 6,
    },
    {
      type: 'input',
      input_key: 'break_time_start',
      title: 'break_time_start',
      left_col: 6,
      right_col: 6,
      col: 6,
    },
    {
      type: 'input',
      input_key: 'break_time_end',
      title: 'break_time_end',
      left_col: 6,
      right_col: 6,
      col: 6,
    },
    {
      type: 'input-number',
      input_key: 'volume',
      title: 'volume',
      left_col: 3,
      right_col: 6,
    },
    {
      type: 'input-number',
      input_key: 'weight',
      title: 'weight',
      left_col: 3,
      right_col: 6,
    },
    {
      type: 'input-number',
      input_key: 'type',
      title: 'type',
      left_col: 3,
      right_col: 6,
    },
    {
      type: 'input',
      input_key: 'priority',
      title: 'priority',
      left_col: 3,
      right_col: 6,
    },
    {
      type: 'input',
      input_key: 'time_to_leave',
      title: 'time_to_leave',
      left_col: 3,
      right_col: 6,
    },
    {
      type: 'input',
      input_key: 'reverse_delivery',
      title: 'reverse_delivery',
      left_col: 3,
      right_col: 6,
    },
  ],
});

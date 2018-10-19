import Colr from 'colr';

const planColor = (index, total) => {
  const color = Colr.fromHsv(360 * index / total, 75, 75);

  return color.toHex();
};

const percentageColor = (percentage) => {
  const rangeUnder = 80;
  const rangeAbove = 100;
  if (percentage < rangeUnder) {
    return '#4dbd74';
  } if (percentage <= rangeAbove && percentage >= rangeUnder) {
    return '#ffc107';
  }

  return '#f86c6b';
};

const planColorWithId = (state, planId) => {
  const { plans } = state.fleet.data;
  if (plans) {
    const index = plans.findIndex(plan => plan.id === planId);

    return planColor(index, plans.length);
  }

  return 'transparent';
};

const ColorHelper = {
  percentageColor,
  planColor,
  planColorWithId,
};

export default ColorHelper;

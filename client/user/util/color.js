const renderColor = (percentage) =>{ //eslint-disable-line
  const rangeUnder = 80;
  const rangeAbove = 100;
  if (percentage < rangeUnder) {
    return '#4dbd74';
  } if (percentage <= rangeAbove && percentage >= rangeUnder) {
    return '#ffc107';
  }

  return '#f86c6b';
};
export default renderColor;

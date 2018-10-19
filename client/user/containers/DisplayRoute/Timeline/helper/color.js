import Colr from 'colr';

const pathColor = (index, total) => {
  const color = Colr.fromHsv(360 * index / total, 75, 75);

  return color.toHex();
};

const ColorHelper = {
  pathColor,
};

export default ColorHelper;

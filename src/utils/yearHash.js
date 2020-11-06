// TODO 还得根据数据改
// TODO 还得提取一下函数

// 求对应的映射值
const hash = {
  2019: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  2020: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
};
const years = [
  [2019, 7],
  [2020, 6],
];

const YEAR_HASH = {};
years.forEach((d) => {
  // 按年份计算日期
  const year = d[0];
  let index = d[1];
  const dt = new Date(Date.UTC(year, 0, 1));

  let count = 0;
  let indexMonth = 0;
  while (dt <= new Date(Date.UTC(year, 11, 31))) {
    const month = dt.getMonth();

    if (count === 7) {
      index += 7;
      count = 0;

      if (index > hash[year][indexMonth]) {
        index -= hash[year][indexMonth];
        indexMonth += 1;
      }
    }

    YEAR_HASH[dt.toISOString().substr(0, 10)] = [
      `${year}-${String(`0${month + 1}`).slice(-2)}-01`,

      `${year}-${String(`0${indexMonth + 1}`).slice(-2)}-${String(`0${index}`).slice(-2)}`,

      dt.toISOString().substr(0, 10),
    ];

    dt.setDate(dt.getDate() + 1);
    count += 1;
  }
});

export default YEAR_HASH;

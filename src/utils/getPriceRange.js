const getPriceRange = (barChartData) => {
  const priceRanges = [
    { range: "0 - 100", count: 0 },
    { range: "101 - 200", count: 0 },
    { range: "201 - 300", count: 0 },
    { range: "301 - 400", count: 0 },
    { range: "401 - 500", count: 0 },
    { range: "501 - 600", count: 0 },
    { range: "601 - 700", count: 0 },
    { range: "701 - 800", count: 0 },
    { range: "801 - 900", count: 0 },
    { range: "901-above", count: 0 },
  ];

  barChartData.forEach((bucket) => {
    if (bucket._id === 0) {
      priceRanges[0].count = bucket.count;
    } else if (bucket._id === 101) {
      priceRanges[1].count = bucket.count;
    } else if (bucket._id === 201) {
      priceRanges[2].count = bucket.count;
    } else if (bucket._id === 301) {
      priceRanges[3].count = bucket.count;
    } else if (bucket._id === 401) {
      priceRanges[4].count = bucket.count;
    } else if (bucket._id === 501) {
      priceRanges[5].count = bucket.count;
    } else if (bucket._id === 601) {
      priceRanges[6].count = bucket.count;
    } else if (bucket._id === 701) {
      priceRanges[7].count = bucket.count;
    } else if (bucket._id === 801) {
      priceRanges[8].count = bucket.count;
    } else if (bucket._id === 901) {
      priceRanges[9].count = bucket.count;
    }
  });

  return priceRanges;
};

export default getPriceRange;

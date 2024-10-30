import axios from "axios";
import Transaction from "../models/transactionModel.js";
import getPriceRange from "../utils/getPriceRange.js";

const seedData = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.API_URL}`);
    // process.env.API_URL = https://s3.amazonaws.com/roxiler.com/product_transaction.json
    await Transaction.deleteMany();
    const transactions = response.data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      sold: item.sold,
      dateOfSale: new Date(item.dateOfSale),
    }));
    await Transaction.insertMany(transactions);
    res.status(201).json({ message: "Database seeded successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch and seed data" });
  }
};

const listTransactions = async (req, res) => {
  try {
    const { monthNumber } = req;
    const { page = 1, perPage = 10, search = "" } = req.query;

    const query = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
    };

    
    if (search) {
      if (!isNaN(search)) {
        const priceSearch = Number(search);
        query.price = { $gte: priceSearch - 1, $lte: priceSearch + 1 };
      } else {
        const searchRegex = new RegExp(search, "i");
        query.$or = [{ title: searchRegex }, { description: searchRegex }];
      }
    }

    const totalTransactions = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    const response = {
      total: totalTransactions,
      page: Number(page),
      perPage: Number(perPage),
      transactions,
    };

    res.status(200).json(response);
    return response;
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

const getStatistics = async (req, res) => {
  const { monthNumber } = req;

  try {
    const statistics = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthNumber],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: {
            $sum: {
              $cond: [{ $eq: ["$sold", true] }, "$price", 0],
            },
          },
          totalSoldItems: {
            $sum: {
              $cond: [{ $eq: ["$sold", true] }, 1, 0],
            },
          },
          totalNotSoldItems: {
            $sum: {
              $cond: [{ $eq: ["$sold", false] }, 1, 0],
            },
          },
        },
      },
    ]);

    if (statistics.length === 0) {
      return res.status(200).json({
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0,
      });
    }

    const { totalSaleAmount, totalSoldItems, totalNotSoldItems } =
      statistics[0];

    res.status(200).json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });

    return { totalSaleAmount, totalSoldItems, totalNotSoldItems };
  } catch (error) {
    console.error("Error while fetching statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

const getBarChart = async (req, res) => {
  const { monthNumber } = req;

  try {
    const barChartData = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthNumber],
          },
        },
      },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [
            0,
            101,
            201,
            301,
            401,
            501,
            601,
            701,
            801,
            901,
            Infinity,
          ],
          default: "901-above",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    const priceRanges = getPriceRange(barChartData);

    res.status(200).json(priceRanges);

    return priceRanges;
  } catch (error) {
    console.error("Error while fetching bar chart data:", error);
    res.status(500).json({ error: "Failed to fetch bar chart data" });
  }
};

const getPieChart = async (req, res) => {
  const { monthNumber } = req;

  try {
    const pieChartData = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthNumber],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const result = pieChartData.map((item) => ({
      category: item._id,
      items: item.count,
    }));

    res.status(200).json(result);

    return result;
  } catch (error) {
    console.error("Error while fetching Pie chart data:", error);
    res.status(500).json({ error: "Failed to fetch Pie chart data" });
  }
};

const getCombinedData = async (req, res) => {

  const { month } = req.query;

  try {

    if(!month) {res.status(400).json({ error: "month parameter required" });  return null};

    // INTERNAL_CALL_URL = http://localhost:5000/api/
    const transactionsResponse = await axios.get(
      `${process.env.INTERNAL_CALL_URL}transactions?month=${month}`
    );
    // INTERNAL_CALL_URL = http://localhost:5000/api/
    const statisticsResponse = await axios.get(
      `${process.env.INTERNAL_CALL_URL}transactions/statistics?month=${month}`
    );
  // INTERNAL_CALL_URL = http://localhost:5000/api/
    const barChartResponse = await axios.get(
      `${process.env.INTERNAL_CALL_URL}transactions/bar-chart?month=${month}`
    );
    // INTERNAL_CALL_URL = http://localhost:5000/api/
    const pieChartResponse = await axios.get(
      `${process.env.INTERNAL_CALL_URL}transactions/pie-chart?month=${month}`
    );

    
    const combinedResponse = {
      transactions: transactionsResponse.data,
      statistics: statisticsResponse.data,
      barChart: barChartResponse.data,
      pieChart: pieChartResponse.data,
    };

    res.status(200).json(combinedResponse);
  } catch (error) {
    console.error("Error while fetching combined data:", error.message);
    res.status(500).json({ error: "Failed to fetch combined data" });
  }
};

export {
  seedData,
  listTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
};

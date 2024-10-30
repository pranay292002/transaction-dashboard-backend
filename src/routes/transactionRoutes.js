import express from "express";
import {
  seedData,
  listTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
} from "../controllers/transactionController.js";
import validateMonth from "../middlewares/validateMonth.js";

const router = express.Router();

router.get("/seed", seedData);   //  http://localhost:5000/api/transactions/seed
router.get("/", validateMonth, listTransactions);   //  http://localhost:5000/api/transactions?month=March
router.get("/statistics", validateMonth, getStatistics);   //  http://localhost:5000/api/transactions/statistics?month=March
router.get("/bar-chart", validateMonth, getBarChart);   //  http://localhost:5000/api/transactions/bar-chart?month=March
router.get("/pie-chart", validateMonth, getPieChart);   //  http://localhost:5000/api/transactions/pie-chart?month=March
router.get("/combined-data", getCombinedData);   //  http://localhost:5000/api/transactions/combined-data?month=March

export default router;

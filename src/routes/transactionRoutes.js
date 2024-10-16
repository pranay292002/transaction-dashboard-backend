import express from "express";
import {
  seedData,
  listTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData
} from "../controllers/transactionController.js";
import validateMonth from "../middlewares/validateMonth.js";

const router = express.Router();

router.get("/seed", seedData);
router.get("/", validateMonth, listTransactions);
router.get("/statistics", validateMonth, getStatistics);
router.get("/bar-chart", validateMonth, getBarChart);
router.get("/pie-chart", validateMonth, getPieChart);
router.get("/combined-data", getCombinedData)


export default router;

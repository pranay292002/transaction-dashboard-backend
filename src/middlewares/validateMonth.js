import getMonthNumber from "../utils/getMonthNumber.js";

const validateMonth = (req, res, next) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "Month is required" });
  }

  const monthNumber = getMonthNumber(month);

  if (monthNumber === 0) {
    return res.status(400).json({ error: "Invalid month" });
  }

  req.monthNumber = monthNumber;

  next();
};

export default validateMonth;

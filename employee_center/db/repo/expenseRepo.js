import { DBConnection } from "../db.js";
import dayjs from "dayjs";
import { group } from "group-items";

const expenseRepo = {};

expenseRepo.getByStartOfYear = async (resolve, reject) => {
  const paycheckDb = DBConnection.Paycheck;

  const startPeriod = dayjs(new Date()).startOf("year").toDate();

  const builtWeekId = `${(startPeriod.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${startPeriod
    .getDate()
    .toString()
    .padStart(2, "0")}/${startPeriod.getFullYear()}`;

  let paycheck = await paycheckDb
    .find()
    .where("week")
    .gte(builtWeekId)
    .select("week name basePay")
    .lean();

  const grouped = group(paycheck)
    .by((x) => x.week)
    .asEntries();

  const total = grouped.reduce((acc, item) => {
    return (
      acc +
      item.items
        .map((x) => x.basePay)
        .reduce((accWeek, week) => accWeek + week, 0)
    );
  }, 0);

  resolve({
    totalYear: total,
    graph: grouped,
  });
};

export default expenseRepo;

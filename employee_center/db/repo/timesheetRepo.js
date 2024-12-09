import { DBConnection } from "../db.js";

const timesheetRepo = {};

timesheetRepo.getById = async (id, resolve, reject) => {
  const timesheetDb = DBConnection.Timesheet;

  let timesheet = await timesheetDb
    .findOne()
    .where("timesheetId")
    .eq(Number(id))
    .lean();

  resolve(timesheet);
};

timesheetRepo.getAllByUserId = async (id, resolve, reject) => {
  const timesheetDb = DBConnection.Timesheet;

  let timesheets = await timesheetDb
    .find()
    .where("employeeId")
    .eq(Number(id))
    .lean();

  resolve(timesheets);
};

timesheetRepo.getLimitedDashboardByUserId = async (id, resolve, reject) => {
  const timesheetDb = DBConnection.Timesheet;

  let timesheets = await timesheetDb
    .find()
    .where("employeeId")
    .eq(Number(id))
    .sort({ weekId: "desc" })
    .limit(5)
    .lean();

  resolve(timesheets);
};

timesheetRepo.getAllToReviewByUserId = async (req, id, resolve, reject) => {
  const { limit } = req.query;

  const timesheetDb = DBConnection.Timesheet;
  const employeeDb = DBConnection.Employee;

  let reviewTimesheets = await timesheetDb
    .find()
    .where("routedTo")
    .eq(Number(id))
    .where("employeeId")
    .ne(Number(id))
    .lean();
  if (!!reviewTimesheets.length) {
    let employees = await employeeDb
      .find()
      .where("id")
      .in(reviewTimesheets.map((x) => x.employeeId))
      .select("firstName lastName id")
      .lean();

    reviewTimesheets = reviewTimesheets.map((x) => {
      const { firstName, lastName } = employees.find(
        (emp) => emp.id === x.employeeId
      );
      x.employee = { firstName, lastName };
      return x;
    });
    if (limit) {
      reviewTimesheets = reviewTimesheets.slice(0, Number(limit));
    }
  }

  resolve(reviewTimesheets);
};

timesheetRepo.updateTimesheet = async (id, timesheet, resolve, reject) => {
  const timesheetDb = DBConnection.Timesheet;

  let { modifiedCount } = await timesheetDb.updateOne(
    { timesheetId: Number(id) },
    { ...timesheet }
  );

  if (modifiedCount > 0) {
    resolve(timesheet);
  } else {
    reject({ msg: "Error updating timesheet" });
  }
};

timesheetRepo.createTimesheet = async (timesheet, resolve, reject) => {
  const timesheetDb = DBConnection.Timesheet;

  const existing = await timesheetDb
    .findOne()
    .where("weekId")
    .eq(timesheet.weekId)
    .where("employeeId")
    .eq(timesheet.employeeId)
    .lean();

  if (existing) {
    resolve(existing);
  } else {
    timesheet.timesheetId =
      Math.max(...(await timesheetDb.find().lean()).map((x) => x.timesheetId)) +
      1;
    let model = new timesheetDb({ ...timesheet });

    model.save();

    resolve(timesheet);
  }
};

timesheetRepo.routeTimesheet = async (timesheet, resolve, reject) => {
  const timesheetDb = DBConnection.Timesheet;
  const employeeDb = DBConnection.Employee;

  let existing = await timesheetDb
    .findOne()
    .where("weekId")
    .eq(timesheet.weekId)
    .where("employeeId")
    .eq(timesheet.employeeId)
    .lean();

  if (!existing) {
    reject({ message: "Error finding timesheet" });
  } else {
    let employee = await employeeDb
      .findOne()
      .where("id")
      .eq(timesheet.employeeId)
      .lean();

    if (!employee) {
      reject({ message: "Unable to find user" });
    } else if (employee.reportsTo === 0) {
      reject({ message: "Reports to not set up properly" });
    } else {
      timesheet.status = "Submitted";
      let { modifiedCount } = await timesheetDb.updateOne(
        { weekId: timesheet.weekId, employeeId: timesheet.employeeId },
        { ...timesheet, routedTo: employee.reportsTo }
      );

      if (modifiedCount > 0) {
        resolve(timesheet);
      } else {
        reject({ message: "Unable to update timesheet" });
      }
    }
  }
};

timesheetRepo.reRouteTimesheet = async (timesheet, resolve, reject) => {
  const timesheetDb = DBConnection.Timesheet;
  const employeeDb = DBConnection.Employee;
  const chargeDb = DBConnection.ChargeCode;

  let existing = await timesheetDb
    .findOne()
    .where("weekId")
    .eq(timesheet.weekId)
    .where("employeeId")
    .eq(timesheet.employeeId)
    .lean();

  if (!existing) {
    reject({ message: "Error finding timesheet" });
  } else {
    let employee = await employeeDb
      .findOne()
      .where("id")
      .eq(timesheet.employeeId)
      .lean();

    if (!employee) {
      reject({ message: "Unable to find user" });
    } else {
      if (timesheet.status === "Approved") {
        timesheet.days.forEach(async (day) => {
          if (day.ChargeCode !== "") {
            let existingCode = await chargeDb
              .findOne()
              .where("code")
              .eq(day.chargeCode)
              .lean();
            if (existingCode) {
              let code = await chargeDb.updateOne(
                { code: day.chargeCode },
                { hours: existingCode.hours - day.total }
              );
            }
          }
        });
      }
      let res = await timesheetDb.updateOne(
        { weekId: timesheet.weekId, employeeId: timesheet.employeeId },
        { ...timesheet, routedTo: employee.id }
      );
    }
  }
};

export default timesheetRepo;

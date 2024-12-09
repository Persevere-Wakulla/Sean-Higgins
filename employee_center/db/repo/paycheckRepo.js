import { randomUUID } from "crypto";
import { DBConnection } from "../db.js";

const paycheckRepo = {};

paycheckRepo.getById = async (id, resolve, reject) => {
  const paycheckDb = DBConnection.Paycheck;

  let paycheck = await paycheckDb
    .findOne()
    .where("payCheckId")
    .eq(Number(id))
    .lean();

  resolve(paycheck);
};

paycheckRepo.getAllByEmployeeId = async (id, query, resolve, reject) => {
  const paycheckDb = DBConnection.Paycheck;
  const { limit } = query;

  let empPayChecks = await paycheckDb
    .find()
    .where("employeeId")
    .eq(Number(id))
    .limit(limit ? Number(limit) : 1000)
    .lean();

  let grossYtd = empPayChecks
    .map((x) => x.basePay)
    .reduce((a, curr) => (a += curr), 0);

  let netYtd = empPayChecks
    .map((x) => x.totalPay)
    .reduce((a, curr) => (a += curr), 0);

  resolve({ paychecks: empPayChecks, netYtd, grossYtd });
};

paycheckRepo.generateChecks = async ({ date }, resolve, reject) => {
  if (date) {
    let paycheckDb = DBConnection.Paycheck;
    let { paychecks, timesheets } = await getValidTimesheets(date);

    if (paychecks.length > 0) {
      try {
        let existingPaychecks = (await paycheckDb.find().lean()).map(
          (x) => x.payCheckId
        );
        let payCheckId =
          existingPaychecks.length > 0 ? Math.max(...existingPaychecks) + 1 : 1;

        paychecks = paychecks.map((empCheck) => {
          empCheck.payCheckId = payCheckId;
          let model = new paycheckDb({ ...empCheck });
          payCheckId++;
          return model;
        });

        try {
          paychecks.forEach((x) => {
            x.save();
          });

          timesheets.map((time) => {
            time.status = "Paid";
            time.save();
          });

          resolve(paychecks);
        } catch (err) {
          reject(err);
        }
      } catch (err) {
        reject(err);
      }
    } else {
      resolve("No paychecks to be cut");
    }
  } else {
    reject("No date supplied");
  }
};

const getValidTimesheets = async (date) => {
  try {
    let timesheetDB = DBConnection.Timesheet;

    const timesheets = await timesheetDB
      .find()
      .where("status")
      .eq("Approved")
      .where("weekId")
      .lte(date)
      .exec();

    if (timesheets.length > 0) {
      let employees = await getEmployeeInfo(
        timesheets.map((sheet) => sheet.employeeId)
      );

      let batchId = randomUUID();
      const paychecks = timesheets.map(time => {
        const employee = employees.find(emp => emp.id === time.employeeId && !emp.isDisabled);
        const basePay = employee.salary / 52;
        const stockContribution = basePay * (employee.stockPercentage / 100);
        const taxes = (basePay - stockContribution) * 0.22;
        const socialSecurity = (basePay - (taxes + stockContribution)) * 0.06;
        let medicalCost = 0;
        if (employee.isEnrolledHealth) {
          const spouseCost = employee.health.spouseIncludedHealth
          ? employee.health.medicalPlan.spouseCost
          : 0;
          medicalCost =
            ((employee.health.medicalPlan.monthlyCost +
            spouseCost +
            (employee.health.dependents *
              employee.health.medicalPlan.dependentsCost)) * 12) / 52;
        }
        
        let totalPay = basePay - (taxes + socialSecurity + stockContribution + medicalCost);

        return {
          name: employee.firstName + " " + employee.lastName,
          employeeId: employee.id,
          week: time.weekId,
          processedOn: new Date(),
          batchId,
          totalPay,
          basePay,
          medicalCost,
          taxes,
          socialSecurity,
          stockContribution,
          contributionPercentage: employee.stockPercentage,
          ssn: employee.ssn,
          title: employee.company.title,
          company: employee.company.name,
          employeeAddress: {
            street: employee.address.address,
            city: employee.address.city,
            state: employee.address.stateCode,
            zip: employee.address.postalCode,
          },
        };
      })

      return {
        paychecks,
        timesheets,
      };
    }
    return {
      timesheets: [],
      paychecks: [],
    };
  } catch (err) {}
};

const getEmployeeInfo = async (ids) => {
  const empDb = DBConnection.Employee;

  let employees = await empDb
    .find()
    .where("id")
    .in(ids)
    .populate("health.medicalPlan")
    .select(
      "firstName lastName id reportsTo projectId company address ssn stockPercentage salary isEnrolledHealth health"
    )
    .lean();

  return employees;
};

export default paycheckRepo;

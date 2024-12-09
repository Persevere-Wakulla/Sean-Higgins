import mongoose from 'mongoose';
import timesheetSchema from './schema/timesheet.js';
import employeeSchema from './schema/employee.js';
import paycheckSchema from './schema/paycheck.js';
import chargeCodeSchema from './schema/chargeCode.js';
import projectSchema from './schema/project.js';
import medicalSchema from './schema/medical.js';

export class DBConnection {
  static connection;
  static Employee;
  static Timesheet;
  static Paycheck;
  static ChargeCode;
  static Project;
  static Medical;
  static startConnection = async (connectionString) => {
    // Set up default mongoose connection

    mongoose.connect(connectionString, {
        dbName: 'employee_center',
    });
    //  Get the default connection
    
    var db = mongoose.connection;

    this.Employee = db.model('employee', employeeSchema);
    this.Timesheet = db.model('timesheet', timesheetSchema);
    this.Paycheck = db.model('paycheck', paycheckSchema);
    this.ChargeCode = db.model('chargeCode', chargeCodeSchema);
    this.Project = db.model('project', projectSchema);
    this.Medical = db.model('medical', medicalSchema);

    this.connection = db;

    // Bind connection to error event (to get notification of connection errors)
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
  };
}

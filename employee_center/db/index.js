import express from "express";
import cors from "cors";
import path from 'node:path';
import userRouter from './routes/user.js'
import setupUserRouter from "./routes/setupUser.js";
import projectRouter from "./routes/project.js";
import timesheetRouter from "./routes/timesheet.js";
import chargeCodeRouter from "./routes/chargeCode.js";
import payrollRouter from "./routes/payroll.js";
import expenseRouter from "./routes/expense.js";
import medicalRouter from "./routes/medical.js";
import https from 'node:https'
import { copyFile } from 'node:fs/promises';
import { DBConnection } from "./db.js";

const app = express();
const port = 3000;

var mongoDB = 'mongodb://127.0.0.1/employee_center';

DBConnection.startConnection(mongoDB);

const router = express.Router();

router.use('/user', userRouter);
router.use('/setupUser', setupUserRouter);
router.use('/project', projectRouter);
router.use('/timesheet', timesheetRouter);
router.use('/chargeCode', chargeCodeRouter);
router.use('/payroll', payrollRouter);
router.use('/expense', expenseRouter);
router.use('/medical', medicalRouter);


app.use(express.json());
app.use(cors());

app.use('/api', router);

app.listen(port, () => console.log(`Employee Center API listening on port ${port}`));

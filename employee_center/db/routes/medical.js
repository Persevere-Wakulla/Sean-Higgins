import express from "express";
import { DBConnection } from "../db.js";
import medicalRepo from "../repo/medicalRepo.js";

const medicalRouter = express.Router();


medicalRouter.get("/", async (req, res, next) => {
    const medicalDb = DBConnection.Medical

    let plans = await medicalDb.find().lean();

    res.send({
        status: 200,
        statusText: "OK",
        data: plans
    })
});

medicalRouter.post("/", async (req, res, next) => {
  await medicalRepo.enrollMedical(
    req.body,
    (data) => {
      if (data) {
        res.send({
          status: 201,
          statusText: "OK",
          data,
        });
      }
    },
    (err) => next(err)
  );
});

export default medicalRouter;

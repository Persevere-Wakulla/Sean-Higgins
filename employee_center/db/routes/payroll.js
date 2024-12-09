import express from "express";
import paycheckRepo from "../repo/paycheckRepo.js";

const payrollRouter = express.Router();

payrollRouter.get("/:id", (req, res, next) => {
    paycheckRepo.getById(
    req.params.id,
    (data) => {
      if (data) {
        res.send({
          status: 200,
          statusText: "OK",
          data,
        });
      }
    },
    (err) => next(err)
  );
});

payrollRouter.get("/employee/:id", (req, res, next) => {
    paycheckRepo.getAllByEmployeeId(
    req.params.id,
    req.query,
    (data) => {
      if (data) {
        res.send({
          status: 200,
          statusText: "OK",
          data,
        });
      }
    },
    (err) => next(err)
  );
});

payrollRouter.post("/run", async (req, res, next) => {
  await paycheckRepo.generateChecks(
    req.body,
    (data) => {
      if (data) {
        res.send({
          status: 201,
          statusText: "OK",
          data: {
            checks: data
          },
        });
      }
    },
    (err) => next(err)
  );
});

export default payrollRouter;

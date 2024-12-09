import express from "express";
import expenseRepo from "../repo/expenseRepo.js";

const expenseRouter = express.Router();

expenseRouter.get("/", (req, res, next) => {
    expenseRepo.getByStartOfYear(
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



export default expenseRouter;

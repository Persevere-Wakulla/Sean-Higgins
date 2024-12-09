import express from "express";
import userRepo from "../repo/userRepo.js";
import { generateAccessToken } from "../authToken.js";
import timesheetRepo from "../repo/timesheetRepo.js";
import { DBConnection } from "../db.js";

const userRouter = express.Router();

userRouter.get("/dashboard/:id", (req, res, next) => {
  timesheetRepo.getLimitedDashboardByUserId(
    req.params.id,
    (user) => {
      if (user) {
        res.send({
          status: 200,
          statusText: "OK",
          data: user,
        });
      }
    },
    (err) => next(err)
  );
});

userRouter.get("/find/:id", async (req, res, next) => {
  userRepo.getById(
    req.params.id,
    (user) => {
      if (user) {
        res.send({
          status: 200,
          statusText: "OK",
          data: user,
        });
      }
    },
    (err) => next(err)
  );
});

userRouter.get("/", async (req, res, next) => {
  let employee = DBConnection.Employee;

  const {_doc} = await employee.findOne({id: Math.floor(Math.random() * 208)});
  res.send({
    status: 200,
    statusText: "OK",
    data: _doc,
  });
});

userRouter.get("/all", async (req, res, next) => {
  let employee = DBConnection.Employee;

  const employees = await employee.find().select('firstName lastName username id projectId').lean();
  res.send({
    status: 200,
    statusText: "OK",
    data: employees,
  });

});

userRouter.get("/search", async (req, res, next) => {
  let employee = DBConnection.Employee;

  const employees = await employee.find({role: req.query.role});

  let chosen = employees.map(x => x._doc)[Math.floor(Math.random() * employees.length)];

  res.send({
    status: 200,
    statusText: "OK",
    data: chosen,
  });
});

userRouter.put("/:id", async (req, res, next) => {
  userRepo.updateUser(
    req,
    (user) => {
      if (user) {
        res.send({
          status: 200,
          statusText: "OK",
          data: user,
        });
      }
    },
    (err) => next(err)
  );
});

userRouter.delete("/:id", async (req, res, next) => {
  userRepo.deleteUser(
    req,
    (user) => {
      if (user) {
        res.send({
          status: 201,
          statusText: "OK",
          data: user,
        });
      }
    },
    (err) => next(err)
  );
});

userRouter.post("/create", async (req, res, next) => {
  userRepo.createUser(
    req.body,
    (user) => {
      if (user) {
        res.send({
          status: 201,
          statusText: "OK",
          data: user,
        });
      }
    },
    (err) => next(err)
  );
});

userRouter.post("/login", async (req, res, next) => {
    userRepo.login(
      req.body,
      (user) => {
        if (!user) {
          res.send({
            status: 500,
            statusText: "Bad Request",
            data: {message: 'Login credentials are incorrect'},
          });
        } else {
          res.send({
            status: 200,
            statusText: "OK",
            data: { token: generateAccessToken(req.body.username), user },
          });
        }
      },
      (err) => next(err)
    );
});

export default userRouter;

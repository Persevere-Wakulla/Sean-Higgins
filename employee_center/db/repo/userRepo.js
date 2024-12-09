import { DBConnection } from "../db.js";

const userRepo = {};

userRepo.getById = async (id, resolve, reject) => {
  const empDB = DBConnection.Employee;

  const employee = await empDB.findOne({ id: Number(id) }).populate('health.medicalPlan');

  resolve(employee);
};

userRepo.login = async (credentials, resolve, reject) => {
  const empDB = DBConnection.Employee;

  const result = await empDB
    .findOne({ username: credentials.username, password: credentials.password })
    .lean();

  if (result) {
    resolve(result);
  }
};

userRepo.updateUser = async (req, resolve, reject) => {
  const empDB = DBConnection.Employee;

  const res = await empDB.updateOne(
    { id: Number(req.params.id) },
    { ...req.body }
  );

  resolve(req.body);
};

userRepo.deleteUser = async (req, resolve, reject) => {
  const empDB = DBConnection.Employee;

  const { deletedCount } = await empDB.deleteOne({ id: Number(req.params.id) });

  if (deletedCount === 0) {
    reject("Unable to find user");
  } else {
    resolve(deletedCount);
  }
};

userRepo.createUser = async (user, resolve, reject) => {
  const empDB = DBConnection.Employee;

  let max = Math.max(...(await empDB.find().lean()).map((x) => x.id));

  let model = new empDB({ ...user, id: ++max });

  model.save();

  resolve(model);
};

userRepo.getUsersWithFilteringAndPaging = async (
  id,
  params,
  resolve,
  reject
) => {
  const empDB = DBConnection.Employee;

  const { sortBy, value, order, limit, skip, key } = params;

  let results = empDB.find().where("projectId").in(Number(id));
  let allEmps = await empDB.find().where("projectId").in(Number(id)).lean();

  if (sortBy) {
    results = results.sort([[sortBy, order]]);
  }

  if (key && value !== '') {
    results = await results.exec();
    const users = results.filter(
      (x) =>
        x.firstName.toLowerCase().includes(value.toLowerCase()) ||
        x.lastName.toLowerCase().includes(value.toLowerCase())
    );
    
    resolve({
      users,
      total: users.length,
      limit,
      skip,
      order,
      sortBy,
      value,
      key,
    });
  } else {
    let users = await results
      .skip(Number(skip) > 0 ? Number(skip) - 1 : 0)
      .limit(limit ? Number(limit) : allEmps.length)
      .lean();
      
    users = users.map(x=> {
      let manager = allEmps.find(emp=> emp.id === x.reportsTo);
      if(manager) {
        x.reportsToName = `${manager.firstName} ${manager.lastName}`
      }
      return x;
    })

    resolve({
      users,
      total: allEmps.length,
      limit,
      skip,
      order,
      sortBy,
      value,
      key,
    });
  }
};

export default userRepo;

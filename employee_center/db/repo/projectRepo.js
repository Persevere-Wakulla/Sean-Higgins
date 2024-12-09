import { DBConnection } from "../db.js";

const projectRepo = {};

projectRepo.getById = async (id, resolve, reject) => {
  let projectDb = DBConnection.Project;

  let project = await projectDb
    .findOne()
    .where("projectId")
    .eq(Number(id))
    .lean();

  resolve(project);
};

projectRepo.getAll = async (resolve, reject) => {
  let projectDb = DBConnection.Project;

  let projects = await projectDb.find().lean();

  resolve(projects);
};

projectRepo.createProject = async (data, resolve, reject) => {
  let projectDb = DBConnection.Project;
  let employeeDb = DBConnection.Employee;

  let projectIdMax =
    Math.max(...(await projectDb.find().lean()).map((x) => x.projectId)) + 1;

  let model = new projectDb({ projectId: projectIdMax, name: data.projectName });
  
  model.save();
  
  if(data.employees.length > 0){
    await data.employees.forEach(async emp => {
      let projectId = [...emp.projectId, projectIdMax];
      await employeeDb.updateOne({id: emp.id}, {projectId})
    })
  }
  
  resolve(model._doc);
};

export default projectRepo;

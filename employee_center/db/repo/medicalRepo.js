import { DBConnection } from "../db.js";

const medicalRepo = {};

medicalRepo.enrollMedical = async (data, resolve, reject) => {
  let medicalDb = DBConnection.Medical;
  let employeeDb = DBConnection.Employee;
  
  let modelMedical = await medicalDb.findOne({medicalId: data.medicalId}).lean();

  let modelEmployee = await employeeDb.findOneAndUpdate({id: data.employeeId}, {
    isEnrolledHealth: true,
    health: {
        medicalPlan: modelMedical._id, 
        spouseIncludedHealth: data.spouse,
        dependents: Number(data.dependents)
    }
  }).lean();

  
  resolve(modelEmployee);
};

export default medicalRepo;

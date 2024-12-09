import mongoose from "mongoose";
import emps from './json/employeeWithoutId.json' with {type: 'json'}
import medicalJSON from './json/medical.json' with {type: 'json'}
import projectJSON from './json/project.json' with {type: 'json'}

//Set up default mongoose connection
var mongoDB = "mongodb://127.0.0.1/employee_center";
mongoose.connect(mongoDB, { useNewUrlParser: true });
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const seedDB = async (db) => {
  await db.collection("employee").deleteMany({});
  await db.collection("employee").insertMany(emps);

  await db.collection("medical").deleteMany({});
  await db.collection("medical").insertMany(medicalJSON);

  await db.collection("project").deleteMany({});
  await db.collection("project").insertMany(projectJSON);
};

seedDB(db).then(() => {
    mongoose.connection.close();
})



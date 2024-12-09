import { DBConnection } from "../db.js";

const chargeCodeRepo = {};

chargeCodeRepo.getById = async (id, resolve, reject) => {
  let chargeCodeDb = DBConnection.ChargeCode;

  let code = await chargeCodeDb.findOne({chargeCodeId: Number(id)}).lean();

  resolve(code);
};

chargeCodeRepo.getAllByProjectId = async (id, query, resolve, reject) => {
  let chargeCode = DBConnection.ChargeCode;
  const { limit } = query;

  const codes = await chargeCode
    .find()
    .where('projectId')
    .eq(Number(id))
    .limit(limit !== null ? Number(limit) : 15)
    .lean();

  resolve(codes);
};

chargeCodeRepo.updateChargeCode = async (id, code, resolve, reject) => {
  let chargeCodeDb = DBConnection.ChargeCode;

  let res = await chargeCodeDb.updateOne({chargeCodeId: Number(id)}, {...code});

  resolve(code);
};

chargeCodeRepo.createProjectChargeCode = async(code, resolve, reject) => {
  let chargeCode = DBConnection.ChargeCode;

  let chargeCodeId = Math.max(...(await chargeCode.find().lean()).map(x=> x.chargeCodeId));

  const model = new chargeCode({
    ...code,
    chargeCodeId: ++chargeCodeId,
    originalHours: code.hours
  });

  model.save();

  resolve(model._doc);
};

export default chargeCodeRepo;

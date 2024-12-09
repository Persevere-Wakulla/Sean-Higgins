import mongoose, { Schema } from 'mongoose';
import { DBConnection } from '../db.js';

const employeeSchema = new Schema({
    id: Number,
    firstName: String,
    lastName: String,
    maidenName: String,
    age: Number,
    gender: String,
    email: String,
    phone: String,
    birthDate: String,
    image: String,
    bloodGroup:String,
    height: Number,
    weigth:Number,
    eyeColor: String,
    hair: Object,
    ip: String,
    isEnrolledHealth: {type: Boolean, default: false},
    isEnrolledCrypto: {type: Boolean, default: false},
    health: {
        medicalPlan: {type: mongoose.Schema.ObjectId, ref: 'medical'},
        spouseIncludedHealth: {type: Boolean, default: false},
        dependents: {type: Number, default: 0},
        dentalPlan: {type: mongoose.Schema.ObjectId, ref: 'dental'}
    },
    address: {
        address: String,
        city: String,
        state: String,
        stateCode: String,
        postalCode: String,
        country: String
    },
    macAddress: String,
    university: String,
    bank: {
        cardExpire: String,
        cardNumber: String,
        cardType: String,
        currency: String,
        iban: String
    },
    company: {
        department: String,
        name: String,
        title: String,
        address: {
            address: String,
            city: String,
            state: String,
            stateCode: String,
            postalCode: String,
            country: String
        }
    },
    ein: String,
    ssn: String,
    userAgent: String,
    projectId: Array,
    reportsTo: Number,
    isDisabled: Boolean,
    role: String,
    stockPercentage: Number,
    salary: Number
}, {collection: 'employee', timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}})

const virtualReportsTo = employeeSchema.virtual('reportsToName')

virtualReportsTo.set(async (value, virtual, doc) => {
    const {firstName, lastName} = await DBConnection.Employee.findOne({id: value}).lean()
    this.reportsToName = `${firstName} ${lastName}`;
})

export default employeeSchema;
import { project } from "$lib/stores/layout";
import { get } from "svelte/store";

export class User {
  id!: number;
  password!: string;
  gender!: string;
  hasDegree!: boolean;
  university!: string;
  projectId!: number | undefined;
  address = {
        address: '',
        city: '',
        state: '',
        stateCode: '',
        postalCode: '',
        country: ''
    };
  username!: string;
  role!: string;
  email!: string;
  image!: string;
  firstName!: string;
  lastName!: string;
  bank = {
        cardExpire: '',
        cardNumber: '',
        cardType: '',
        currency: '',
        iban: ''
    };
  company = {
        department: '',
        name: '',
        title: '',
        address: {
            address: '',
            city: '',
            country: '',
            state: '',
            stateCode: '',
            postalCode: 0
        }
    };
  macAddress!: string;
  crypto = {
        coin: '',
        network: '',
        wallet: ''
    };
  ein!: string;
  phone!: string;
  ssn!: string;
  birthDate!: string;
  reportsTo: number;
  isDisabled: boolean;
  constructor() {
    this.reportsTo = 0;
    this.projectId = get(project)?.projectId;
    this.isDisabled = false;
  }
}

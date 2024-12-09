import { writable, type Writable } from "svelte/store";

export type User = {
  id: number;
  password: string;
  gender: string;
  hasDegree: boolean;
  university: string;
  projectId: number[];
  isEnrolledHealth: boolean;
  isEnrolledCrypto: boolean;
  health: {
    medicalPlan: {
      name: string,
      medicalId: number,
      monthlyCost: number,
      dependentsCost: number,
      descr: string,
      benefitsDetails: string,
      spouseCost: number,
      hasDeductible: boolean,
      deductibleAmount: number,
      copayments: {
        primaryCare: number,
        specialist: number,
        outOfNetwork: number
      }
    };
    spouseIncludedHealth: boolean;
    dependents: number;
  }
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string
    postalCode: string;
    country: string;
  }
  username: string;
  role: string;
  email: string;
  image: string;
  firstName: string;
  lastName: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
    address: {
      address: string;
      city: string;
      country: string;
      state: string;
      stateCode: string;
      postalCode: number;
    };
  };
  macAddress: string;
  crypto: {
    coin: string;
    network: string;
    wallet: string;
  };
  ein: string;
  phone: string;
  ssn: string;
  birthDate: string;
  reportsTo: number;
  salary: number;
  isDisabled: boolean;
}

export type Timesheet = {
  timesheetId: number,
  employeeId: number,
  weekId: string,
  status: string,
  days: Day[]
}

export type Day = {
  id: string,
  date: string,
  start: string,
  end: string,
  break: string,
  total: number,
  chargeCode: string,
  note: string | undefined
}

export type Project = {
  projectId: number,
  name: string
}

export type ChargeCode = {
  projectId: number,
  chargeCodeId: number,
  code: string,
  descr: string
}

export const defaultDay = {
  date: '',
  start: '',
  end: '',
  break: '',
  total: 0,
  chargeCode: ''
} as Day

export const sideBarIsOpen: Writable<Boolean> = writable(false);

export const user: Writable<User> = writable({} as User);

export const user_token: Writable<String | null> = writable(null);

export const project: Writable<Project | null> = writable(null);

export const currentTimesheet: Writable<Timesheet> = writable({} as Timesheet);

export const projectChargeCodes: Writable<ChargeCode[]> = writable([]);

export const notePops: Writable<NotePop[]> = writable([]);

export const allProjects: Writable<Project[]> = writable([])

export const isImpersonating: Writable<boolean> = writable(false);

export const originalUser: Writable<User> = writable({} as User);
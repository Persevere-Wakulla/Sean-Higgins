export default interface PayCheck {
    basePay: number,
    batchId: string,
    company: string,
    employeeAddress: {
        street: string,
        city: string,
        state: string,
        zip: string
    }
    employeeId: number,
    name: string,
    payCheckId: number,
    ssn: string,
    socialSecurity: number,
    stockContribution: number,
    taxes: number,
    title: string,
    totalPay: number,
    medicalCost: number,
    week: string
}
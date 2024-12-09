import type { Day } from "../stores/layout";

export class Timesheet{
    #days: Day[];
    #id: string;
    #employeeId: number;
    #status: string;
    #weekId: string;
    #routedTo: number;
    constructor(employeeId: number, week:string) {
        this.#days = [] as Day[];
        this.#id = crypto.randomUUID();
        this.#employeeId = employeeId;
        this.#status = 'Unsubmitted';
        this.#weekId = week;
        this.#routedTo = 0;
    }
    updateDays(days: Day[]){
        days = days.map(x => {x.id = crypto.randomUUID(); return x;});
        this.#days = days;
    }
    setStatus(status: string){
        this.#status = status;
    }
    toJson(){
        return {
            id: this.#id,
            employeeId: this.#employeeId,
            status: this.#status,
            weekId: this.#weekId,
            days: this.#days,
            routedTo: this.#routedTo
        }
    }
}
import { project } from "$lib/stores/layout";
import { get } from "svelte/store";

export default class Charge{
    #projectId: number | undefined;
    #id: string;
    #chargeCodeId: number;
    #code!: string;
    #hours: number;
    #rate: number;
    #additionalHours: number;
    constructor(){
        this.#id = crypto.randomUUID();
        this.#projectId = get(project)?.projectId;
        this.#chargeCodeId = 0;
        this.#hours = 0;
        this.#rate = 0;
        this.#additionalHours = 0;
    }
    getJson() {
        return {
            id: this.#id,
            projectId: this.#projectId,
            chargeCodeId: this.#chargeCodeId,
            code: this.#code,
            hours: this.#hours,
            rate: this.#rate,
            additionalHours: this.#additionalHours
        }
    }
}
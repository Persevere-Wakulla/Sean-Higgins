import { user } from "$lib/stores/layout";
import { get } from "svelte/store";
import type { PageServerLoad } from "./$types";
import { getAll, post } from "$lib/database/server";
import type { Actions } from "@sveltejs/kit";
export const load = (async () => {
  if (!get(user).isEnrolledHealth) {
    const {data} = await getAll('medical');
    return { isEnrolled: false, plans: data };
  }
  return { isEnrolled: true };
}) satisfies PageServerLoad;

export const actions = {
    enroll: async({request, params}) =>{
        const formData = await request.formData();

        const employeeId = Number(params.user);
        const medicalId = formData.get('medicalId');
        const dependents = Number(formData.get('dependents'));
        let spouse = formData.get('coverSpouse') ?? false;
        if(spouse === 'on') spouse = true;

        const res = await post('medical', {
            employeeId,
            medicalId,
            dependents,
            spouse
        })
    }
} satisfies Actions
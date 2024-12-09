import { getAll, getById } from "$lib/database/server";
import { get } from "svelte/store";
import type { PageServerLoad } from "./$types"
import { user } from "$lib/stores/layout";



export const load = (async ({params, depends}) => {
    depends('dashboard:projectId');
    try{
        const {data} = await getById('user/dashboard', Number(params.user));
        if(get(user).role === 'admin'){
            const response = await getAll(`timesheet/review/${Number(params.user)}?limit=5`);
            const chargeCodeResponse = await getAll(`chargeCode/project/${Number(params.project)}?limit=5`);
            return {timesheets: data, toReview: response.data, chargeCodes: chargeCodeResponse.data};
        }
        return {timesheets: data};
        
    }
    catch(err){
        console.dir(err);
    }
}) satisfies PageServerLoad;
import { getAll, post } from '$lib/database/server';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    const {data} = await getAll('user/all');
    
    return {employees: data};
}) satisfies PageServerLoad;


export const actions: Actions = {
    project: async ({request, params}) =>{
        const formData = await request.formData();

        const projectName = formData.get('projectName')
        const employeesForm = formData.get('employees')

        let employees = JSON.parse(employeesForm);

        const {data} = await post('project', {projectName, employees});
        
        return {
            project: data
        }
    }
};
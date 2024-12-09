import { getById } from '$lib/database/server';
import type { PageServerLoad } from './$types';


export const load = (async ({params}) => {
    const {data} = await getById('chargeCode/project', Number(params.project)) as any;
    
    return {codes: data};
}) satisfies PageServerLoad;
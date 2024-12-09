import { getById } from '$lib/database/server';
import type { PageServerLoad } from './$types';

export const load = (async ({params}) => {
    const {data} = await getById('payroll', Number(params.check)) as any;
    
    return {check: data};
}) satisfies PageServerLoad;
import { getById } from '$lib/database/server';
import type { PageServerLoad } from './$types';

export const load = (async ({params}) => {
    const {data} = await getById('/timesheet/review', Number(params.user)) as any;
    
    return {
        toReview: data};
}) satisfies PageServerLoad;
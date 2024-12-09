import { getById } from '$lib/database/server';
import type { PageServerLoad } from './$types';

export const load = (async ({params}) => {
    const {data} = await getById('timesheet', Number(params.reviewId)) as any;
    
    const responseChargeCodes = await getById('chargeCode/project', Number(params.project));
    return {
        timesheet: data,
        isReview: true, chargeCodes: responseChargeCodes.data
    };
}) satisfies PageServerLoad;
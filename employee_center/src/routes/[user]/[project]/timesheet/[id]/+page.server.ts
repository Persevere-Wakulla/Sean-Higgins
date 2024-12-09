import { getById } from '$lib/database/server';
import type { PageServerLoad } from './$types';

export const load = (async ({params}) => {
    const response = await getById('timesheet', Number(params.id));
    const responseChargeCodes = await getById('chargeCode/project', Number(params.project));
    return {timesheet: response.data, chargeCodes: responseChargeCodes.data, isReview: false};
}) satisfies PageServerLoad;
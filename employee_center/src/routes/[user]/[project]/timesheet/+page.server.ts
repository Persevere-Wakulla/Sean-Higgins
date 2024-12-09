import { getById } from '$lib/database/server';
import type { PageServerLoad, RouteParams } from './$types';

export const load = (async ({params}: {params: RouteParams}) => {
    const response = await getById('timesheet/user', Number(params.user));
    return {userTimesheets: response.data};
}) satisfies PageServerLoad;
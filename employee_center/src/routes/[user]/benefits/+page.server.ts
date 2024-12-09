import { getById } from '$lib/database/server';
import type { PageServerLoad } from './$types';

export const load = (async ({params}) => {
    const {data} = await getById('payroll/employee', Number(params.user)) as any;
    console.dir(data)
    return {grossYtd: data.grossYtd, netYtd: data.netYtd};
}) satisfies PageServerLoad;
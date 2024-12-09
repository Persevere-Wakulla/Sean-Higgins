import { getById } from '$lib/database/server';
import type { PageServerLoad } from './$types';

export const load = (async ({params}) => {

    const {data} = await getById('payroll/employee', Number(params.user)) as any;

    return {checks: data.paychecks, netYtd: data.netYtd, grossYtd: data.grossYtd};
}) satisfies PageServerLoad;
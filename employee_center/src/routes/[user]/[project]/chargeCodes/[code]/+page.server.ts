import { getById } from '$lib/database/server';
import type { PageServerLoad } from './$types';

export const load = (async ({params}) => {
    const {data} = await getById('chargeCode', Number(params.code)) as any;

    return {chargeCode: data};
}) satisfies PageServerLoad;
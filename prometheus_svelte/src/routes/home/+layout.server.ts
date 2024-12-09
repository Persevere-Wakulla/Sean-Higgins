import fs from 'fs';
import type { LayoutServerLoad } from '../$types';

export const load = (async (event) => {

    const session = await event.locals.auth()
	const GET_SUBSCRIBER = fs.readFileSync(
		'./src/routes/api/graphql/queries/GET_SUBSCRIBER.graphql',
		'utf-8'
	);
    return {
        GET_SUBSCRIBER,
        session
    };
}) satisfies LayoutServerLoad;
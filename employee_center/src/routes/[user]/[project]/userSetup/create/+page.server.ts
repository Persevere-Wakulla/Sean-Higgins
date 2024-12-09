import { getAll } from '$lib/database/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const response = (await getAll(
      `/setupUser/project/${params.project}/filter/?skip=0&key=role&value=admin`
    )) as any;
  
    return { reportsToUsers: response.data.users };
  };
  
import { getAll, getById } from "$lib/database/server";
import type { PageLoad } from "../../../$types";

export const load: PageLoad = async ({ params }) => {
  const { data } = (await getById("/user/find", Number(params.id))) as any;

  const response = (await getAll(
    `/setupUser/project/${params.project}/filter/?skip=0&key=role&value=admin`
  )) as any;

  return { user: data, reportsToUsers: response.data.users };
};

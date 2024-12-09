import { getAll } from "$lib/database/server";
import type { PageServerLoad } from "./$types";

export const load = (async ({depends}) => {
  depends('budget:week')
  const { data } = await getAll("expense");

  return { paychecks: data.graph, totalYear: data.totalYear };
}) satisfies PageServerLoad;

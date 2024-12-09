import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getById } from "$lib/database/server";
import { type User } from "../../lib/stores/layout";

export const load: LayoutServerLoad = async ({ cookies, route, params }) => {
  const token = cookies.get("token");
  if (!token) {
    throw redirect(308, "/");
  }else {
    const {data} = await getById('/user/find', Number(params.user)) as any;
    
    return data as User
  }
};

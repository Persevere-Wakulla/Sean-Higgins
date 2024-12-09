import { userLogin } from "$lib/database/server";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { user as userStore } from "../lib/stores/layout";

export const actions = {
  login: async ({ cookies, request }) => {
    cookies.delete("token", { path: "/" });
    cookies.delete("id", { path: "/" });
    const data = await request.formData();
    const username = data.get("employee_id");
    if (!username) {
      return {
        message: "Missing username!",
      };
    }
    const password = data.get("password");
    if (!password) {
      return fail(400, { message: "Missing password!"})
    }
    const { token, message, user : userData } = await userLogin({
      username: username as string,
      password: password as string
    });
    if (token) {
      cookies.set("token", token, { path: "/" });
      userStore.set(userData)
      throw redirect(303, `/${userData.id}/${userData.projectId[0]}/dashboard`);
    }
    return {
      message,
    };
  },
} satisfies Actions;

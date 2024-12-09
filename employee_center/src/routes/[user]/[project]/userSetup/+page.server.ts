import { getAll } from "$lib/database/server";
import type { Actions } from "@sveltejs/kit";
import type { PageLoad } from "../../$types";

export type UserResponse = {
    users: [],
    limit: number,
    skip: number,
    total: number;
}
export const actions: Actions = {
    filter: async ({request, params}) =>{
        const form = await request.formData();

        const name = form.get('lastName');
        
        const {data} = await getAll(`setupUser/project/${params.project}/filter?limit=12&skip=0&key=lastName&value=${name}`);
        return {
            users: data.users,
            skip: data.skip,
            total: data.total,
            limit: data.limit,
            order: data.order
        } as UserResponse
    }
};

export const load:PageLoad = async ({url, params, depends}) => {
    depends('userSetup:id');
    const {data} = await getAll(`setupUser/project/${params.project}/filter?limit=12&skip=0`);

    return {
        users: data.users,
        skip: data.skip,
        total: data.total,
        limit: data.limit,
        order: data.order
    } as UserResponse
}
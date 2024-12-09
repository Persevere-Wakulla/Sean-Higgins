import { NextResponse } from "next/server";
import { getData } from "../../lib/server/db";


export async function GET(request: Request) {
    await getData()
    // const results = await blogModel.find()
    // console.dir(results)
    // return NextResponse.json(results)
}
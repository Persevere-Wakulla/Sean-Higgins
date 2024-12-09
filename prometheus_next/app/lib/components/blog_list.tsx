
import { Dispatch, SetStateAction, SyntheticEvent } from "react";
import { BlogType } from "../types/blog";
import BlogItem from "./blog_item";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
export default function BlogList({ blogs, setBlogs, filteredBlogs }: { blogs: Array<BlogType>, setBlogs: Dispatch<SetStateAction<any[]>>, filteredBlogs: Array<BlogType> }) {
    const filter = (e: SyntheticEvent) => {
        const inputEl = e.target as HTMLInputElement;
        inputEl.value !== '' ?
            setBlogs(blogs.filter(x => x.title.toLowerCase().includes(inputEl.value.toLowerCase()))) :
            setBlogs(blogs);
    }
    return <>
        <section className="flex w-full md:justify-around flex-wrap max-md:flex-col max-md:px-4">
            {filteredBlogs && filteredBlogs.map((blog: BlogType) => { blog.date = new Date(blog.date).toDateString(); return blog }).map((blog: BlogType) =>
                <BlogItem blog={blog} />
            )}
        </section>
        <section className="flex flex-col gap-4 md:w-[20%] items-center">
            <div className="bg-white rounded-full px-4 py-1 shadow-inner shadow-neutral-700 flex items-center ju">
                <MagnifyingGlassIcon className="w-8"></MagnifyingGlassIcon>
                <input onChange={filter} autoComplete="current-password" className="rounded-full outline-slate-200 bg-transparent text-xl w-full" type="text" placeholder="Search" />
            </div>
            <div className="max-md:hidden">
                <h4 className="text-white text-2xl">Most popular</h4>
            </div>
        </section>
    </>
}
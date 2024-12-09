"use client"
import { useEffect, useState } from "react";
import BlogList from "../lib/components/blog_list";

export default function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3001/api/blog')
            .then((res) => res.json())
            .then((json) => {setBlogs(json); setFilteredBlogs(json);})
    }, [])
    return <>
        <header className="flex relative max-md:w-full justify-center items-center bg-no-repeat bg-[url('/details.jpg')] bg-cover bg-center5 h-80 shadow-sm shadow-black">
            <h4 className="text-black z-10 font-[desmodus] [font-size:90px] font-extrabold tracking-widest ">Blogs</h4>
        </header>
        <section className="flex max-md:flex-col-reverse w-full mt-10 justify-around">
            <BlogList blogs={blogs} filteredBlogs={filteredBlogs} setBlogs={setFilteredBlogs}></BlogList>
        </section>

    </>
}
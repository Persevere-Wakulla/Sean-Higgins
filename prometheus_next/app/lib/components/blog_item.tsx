import { Ref, useEffect, useRef } from "react";
import { BlogType } from "../types/blog";
import Link from "next/link";
import slugify from "../utils/slugify";
import {BookOpenIcon} from '@heroicons/react/24/outline'

export default function BlogItem({ blog }: { blog: BlogType }) {
    const bgImg: Ref<HTMLDivElement> = useRef()
    useEffect(() => {
        bgImg.current.style.backgroundImage = `url('${blog.img}')`
    }, [])
    return <>
        <Link href={`/blog/${slugify(blog.title)}`} className="md:w-[40%] grid grid-cols-12 gap-2 py-4 duration-500 hover:cursor-pointer">
            <div ref={bgImg} className="peer z-10 row-start-1 col-span-full w-full h-72 bg-no-repeat bg-center shadow-md shadow-black" />
            <div className=" [line-height:1] row-start-2 col-span-full">
                <h4 className="text-white max-md:text-4xl md:[font-size:60px]">{blog.title}</h4>
                <h5 className="text-lg text-white">{blog.date}</h5>
            </div>
            <div className="px-2 flex gap-4 dark:text-white row-start-3 col-span-full">
                <BookOpenIcon className="w-6"></BookOpenIcon>
                <h5 className="text-sm">{blog.minRead} Min</h5>
            </div>
            <p className="px-2 py-1 text-lg dark:text-white first-letter:text-lg col-span-full">{blog.articleSections[0].part.slice(0, 150).padEnd(153, '.')}</p>
        </Link>
    </>
}
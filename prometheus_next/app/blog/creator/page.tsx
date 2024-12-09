"use client"
import { useState } from "react";
import { ArticleSection } from "../../lib/types/blog";

export default function BlogCreator() {
    const defaultSection = {} as ArticleSection



    const [sections, setSections] = useState([defaultSection])
    console.dir(sections)
    const currentDate = new Date(Date.now()).toDateString()
    return <>
        <header className={`flex relative w-with-sidebar bg-center bg-cover border-b-2 border-dashed max-md:w-full self-end justify-center items-center h-96 shadow-sm shadow-black`}>
            <h4 className="text-white text-center z-10 font-[desmodus] text-4xl font-extrabold tracking-widest">
                <input type="text" placeholder="Article Title" className="bg-transparent placeholder:text-black text-center" />
            </h4>
        </header>
        <section className="flex flex-col w-with-sidebar max-md:w-full self-end p-4 items-center">
            <div className="dark:text-white tracking-widest flex gap-20 max-sm:gap-6 max-md:flex max-md:flex-col">
                <div className="flex  max-w-[150px] mt-20 max-md:mt-4 max-md:max-w-full">
                    <div className="flex flex-col shadow-md shadow-black h-fit p-4 text-center max-md:shadow-none">
                        {/* <img className="w-16 rounded-full self-center shadow-md shadow-black" alt="" /> */}
                        <input type="file" className=" file:bg-transparent file:rounded-full file:w-16 file:text-wrap file:border-dashed file:h-16 file:items-center file:justify-center hover:file:border-white hover:file:cursor-pointer" />
                        <h4 className="text-xl"><input type="text" placeholder="Author" className="text-center bg-transparent border-b dark:border-white border-black placeholder:text-black" /></h4>
                        <p className="text-sm"><textarea name="" id="" rows={10} placeholder="About you" className="p-2 bg-transparent mt-4 placeholder:text-black"></textarea></p>
                    </div>
                </div>
                <div className="flex flex-col gap-4 max-w-[600px] max-md:max-w-full">
                    <div className="flex justify-between w-full">
                        <div className="flex gap-4 self-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="dark:fill-white fill-black" width='40px'>
                                <path
                                    d="M542.22 32.05c-54.8 3.11-163.72 14.43-230.96 55.59-4.64 2.84-7.27 7.89-7.27 13.17v363.87c0 11.55 12.63 18.85 23.28 13.49 69.18-34.82 169.23-44.32 218.7-46.92 16.89-.89 30.02-14.43 30.02-30.66V62.75c.01-17.71-15.35-31.74-33.77-30.7zM264.73 87.64C197.5 46.48 88.58 35.17 33.78 32.05 15.36 31.01 0 45.04 0 62.75V400.6c0 16.24 13.13 29.78 30.02 30.66 49.49 2.6 149.59 12.11 218.77 46.95 10.62 5.35 23.21-1.94 23.21-13.46V100.63c0-5.29-2.62-10.14-7.27-12.99z" />
                            </svg>

                            <h5 className="text-lg dark:text-white"></h5>
                        </div>
                        <h4 className="text-lg dark:text-white  self-center">{currentDate}</h4>
                    </div>
                    <form action="">

                        <div className={``}>
                            {sections.map((x, index) => <>
                                <h4 className="text-2xl mb-4 font-extrabold"></h4>
                                <h4 className="text-2xl mb-4 font-extrabold"></h4>
                                {index > 0 && <input className="text-2xl text-black" type="text" placeholder="Section Header" />}
                                <textarea name="" id="" rows={10} className="w-[600px] p-2 bg-transparent resize-y" placeholder="Section Content..."></textarea>

                            </>)}
                        </div>
                    </form>
                    <button onClick={() => setSections([...sections, {} as ArticleSection])}>Add Section</button>



                </div>
                <div className="flex flex-col gap-10 mt-20 text-center items-center">
                    <div>
                        <h4 className="text-2xl">Overview:</h4>
                        <ul>
                            {/* {article.articleSections.map(x => x.sectionHeader).map(x => <>
                                    <li className="text-sm duration-500 transition-all hover:text-blue-500"><Link href={`#${x}`}>{x}</Link></li>
                                </>)} */}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </>
}
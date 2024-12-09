"use client"
import { useParams } from "next/navigation"
import { Ref, useEffect, useRef, useState } from "react"
import { BlogType } from "../../lib/types/blog"
import Link from "next/link"

export default function BlogArticle() {
    const { slug }: { slug: string } = useParams()
    const [article, setArticle] = useState({} as BlogType)
    const headBG: Ref<HTMLElement> = useRef()
    useEffect(() => {
        fetch(`http://localhost:3001/api/blog/${slug}`)
            .then(res => res.json())
            .then(json => {
                json.date = new Date(json.date).toDateString()
                setArticle(json)
                if (headBG.current)
                    headBG.current.style.backgroundImage = `url('${json.img}')`
            })
    }, [slug])

    return <>
        {article._id !== undefined && <>
            <header ref={headBG} className={`flex relative w-with-sidebar bg-center bg-cover max-md:w-full self-end justify-center items-center h-96 shadow-sm shadow-black`}>
                <h4 className="text-white text-center z-10 font-[desmodus] text-4xl font-extrabold tracking-widest">{article.title}</h4>
            </header>
            <section className="flex flex-col  w-with-sidebar max-md:w-full self-end p-4 items-center">
                <div className="dark:text-white tracking-widest flex gap-12 max-sm:gap-6 max-md:flex max-md:flex-col">
                    <div className="flex  max-w-[150px] mt-20 max-md:mt-4 max-md:max-w-full">
                        <div className="flex flex-col shadow-md shadow-black h-fit p-4 text-center max-md:shadow-none">
                            <img src={article?.authorInfo?.avatar} className="w-16 rounded-full self-center shadow-md shadow-black" alt="" />
                            <h4 className="text-xl">{article?.authorInfo?.name}</h4>
                            <p className="text-sm">{article?.authorInfo?.blurb}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 max-w-[600px] max-md:max-w-full">
                        <div className="flex justify-between w-full">
                            <div className="flex gap-4 self-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="dark:fill-white fill-black" width='40px'>
                                    <path
                                        d="M542.22 32.05c-54.8 3.11-163.72 14.43-230.96 55.59-4.64 2.84-7.27 7.89-7.27 13.17v363.87c0 11.55 12.63 18.85 23.28 13.49 69.18-34.82 169.23-44.32 218.7-46.92 16.89-.89 30.02-14.43 30.02-30.66V62.75c.01-17.71-15.35-31.74-33.77-30.7zM264.73 87.64C197.5 46.48 88.58 35.17 33.78 32.05 15.36 31.01 0 45.04 0 62.75V400.6c0 16.24 13.13 29.78 30.02 30.66 49.49 2.6 149.59 12.11 218.77 46.95 10.62 5.35 23.21-1.94 23.21-13.46V100.63c0-5.29-2.62-10.14-7.27-12.99z" />
                                </svg>

                                <h5 className="text-lg dark:text-white">{article.minRead} Min</h5>
                            </div>
                            <h4 className="text-lg dark:text-white  self-center">{article.date}</h4>
                        </div>
                        {article.articleSections.map((x, index) => <>

                            <div className={`float-left`}>
                                {x.sectionHeader && <>
                                    <h4 id={x.sectionHeader} className="text-2xl mb-4 font-extrabold">{x.sectionHeader}</h4>
                                </>}
                                <p className={index === 0 ? 'first-letter:text-[40px]' : ''}>
                                    {x.part.slice(0, x.part.length / 2)}
                                    {(x.imgPosition && x.imgPosition === 'right' || x.imgPosition === 'left') &&
                                        <img src={x.img} alt="" width={x.imgWidth} className={`w-1/2 float-${x.imgPosition} m-4 shadow-md shadow-black ${x.imgPosition === 'left' ? 'ml-0' : 'mr-0'} `} />}
                                    {' ' + x.part.slice(x.part.length / 2)}
                                </p>
                                {(x.imgPosition && x.imgPosition !== 'right' && x.imgPosition !== 'left' || x.imgPosition === '') && <img src={x.img} alt="" width={x.imgWidth} className={`w-1/2 float-${x.imgPosition}shadow-md shadow-black`} />}
                                {x.useDivider && <div className="my-10"></div>}
                            </div>
                        </>)}</div>
                    <div className="flex flex-col gap-10 mt-20 text-center items-center">
                        <div>
                            <h4 className="text-2xl">Overview:</h4>
                            <ul>
                                {article.articleSections.map(x => x.sectionHeader).map(x => <>
                                    <li className="text-sm duration-500 transition-all hover:text-blue-500"><Link href={`#${x}`}>{x}</Link></li>
                                </>)}
                            </ul>
                        </div>
                        <h4 className="text-xl">Recommended Articles</h4>
                        <Link href="" className="grid grid-rows-1 w-40 shadow-md shadow-black hover:scale-105 transition-all duration-500">
                            <div className="bg-slate-900 col-start-1 row-start-1 z-0 bg-opacity-40"></div>
                            <img src="/building.jpg" className="row-start-1 col-start-1 rounded" alt="" />
                            <h4 className="z-10 font-extrabold text-white row-start-1 col-start-1 place-self-center">Where is Crypto Headed</h4>
                        </Link>
                    </div>
                </div>
            </section>
        </>}
    </>
}
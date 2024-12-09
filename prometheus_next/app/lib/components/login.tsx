import Link from "next/link"
import { useRef, useState } from "react"

export default function Login() {
    const [passwordType, setPasswordType] = useState('password')
    const [remember, setRemember] = useState(false)
    return <>
        <section className="md:grid md:grid-cols-12 md:grid-rows-4 flex max-md:flex-col justify-between h-screen max-md:max-w-[600px] max-sm:items-center max-md:m-auto">
            <div className="col-start-1 col-end-13 bg-cover bg-center bg-no-repeat bg-[url('/header.jpg')] row-start-1 row-end-5"></div>
            <div className="row-start-1 flex flex-col md:col-start-1 md:col-end-6">
                <h1 className="[font-size:50px] lg:[font-size:85px] lg:[line-height:115px] font-[desmodus] bg-clip-text bg-gradient-to-br text-transparent from-lime-200 to-lime-600 from-40% text-center tracking-widest">
                    Prometheus
                </h1>
                <p className="max-md:hidden text-center text-white tracking-widest text-xl">Take your power back from the gatekeeping gods</p>

            </div>
            <form className="flex flex-col gap-6 p-4 md:p-0 md:col-start-9 md:row-start-2 md:col-end-11">
                <div>
                    <h4 className="text-4xl text-center font-semibold text-lime-300">Welcome</h4>
                    <p className="text-center text-lg text-white">Log into account</p>
                </div>
                <div className="bg-white rounded-full px-4 py-1 shadow-inner shadow-neutral-700 flex items-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className=" fill-gray-400 stroke-gray-400 mr-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input autoComplete="username" className="rounded-full bg-transparent text-xl w-full" type="text" placeholder="Username" />
                </div>
                <div className="bg-white rounded-full px-4 py-1 shadow-inner shadow-neutral-700 flex items-center ju">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" className="fill-gray-400 stroke-gray-400 mr-1"><path d="M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z" /></svg>
                    <input autoComplete="current-password" className="rounded-full bg-transparent text-xl w-full" type={passwordType} placeholder="Password" />
                    <svg onClick={() => passwordType === 'password' ? setPasswordType('text') : setPasswordType('password')} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 576 512" className={`duration-500 transition-all ${passwordType === 'password' ? 'stroke-gray-400 fill-gray-400 ' : 'stroke-gray-700 fill-gray-700 '} hover:stroke-gray-700 hover:fill-gray-700  hover:cursor-pointer`}><path d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z" /></svg>
                </div>
                <div className="flex gap-4 self-end">
                    <h4 className="text-lg text-white">Remember Me</h4>
                    <div className="self-end">
                        <div onClick={() => setRemember(x => !x)} className="shadow-md rounded-full shadow-gray-900 bg-transparent">
                            <div className="flex w-8 items-center hover:cursor-pointer shadow-inner shadow-gray-600 bg-white rounded-full">
                                <div className={`text-sm bg-gradient-conic from-gray-500 to-gray-300 from-30% duration-500 transition-all border-2 px-2 py-1 ${remember ? 'translate-x-3 from-lime-400 to-lime-600 border-lime-700' : 'translate-x-0'} border-gray-600 rounded-full h-5`}>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="bg-lime-400 select-none py-1 rounded-full shadow-md shadow-gray-800 hover:cursor-pointer hover:bg-lime-600 hover:shadow-none duration-500 transition-all font-semibold tracking-wider">Login</button>
                <div className="flex flex-col gap-1 items-center">
                    <Link href='/forgot'><p className="cursor-pointer text-lg font-extrabold  text-white">Forgot password</p></Link>
                    <p className="text-lg text-white">Don't have an account? <Link href='/registration'><span className="cursor-pointer font-extrabold">Sign Up</span></Link></p>
                </div>
            </form>
            <div className="md:hidden">

            </div>
        </section>
    </>
}
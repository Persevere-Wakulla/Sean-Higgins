import Link from "next/link";

export default function Forgot() {
    return <>
        <section className="flex flex-col justify-between h-screen max-w-[300px] items-center m-auto">
            <h1 className="text-4xl font-[desmodus] text-lime-300 text-center tracking-widest">
                Prometheus
            </h1>
            <section className="flex flex-col gap-6 p-4 md:p-0">
                <div>
                    <h4 className="text-4xl text-center font-semibold text-lime-300">Reset Password</h4>
                    <p className="text-center text-lg text-white">Answer security questions</p>
                </div>
                <div className="bg-white rounded-full px-4 py-1 shadow-inner shadow-neutral-700 flex items-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className=" fill-gray-400 stroke-gray-400 mr-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input className="rounded-full bg-transparent text-xl w-full" type="text" placeholder="Username" />
                </div>
                <div className="bg-white rounded-full px-4 py-1 shadow-inner shadow-neutral-700 flex items-center">
                    <select className="w-full h-full py-1" name="" id="">
                        <option className="selection:text-xl" value=''>Select security question</option>
                        <option className="selection:text-xl" value='dog'>What's your dog's name</option>
                        <option className="selection:text-xl" value='maiden'>Mother's maiden name</option>
                    </select>
                </div>
                <div className="bg-white rounded-full px-4 py-1 shadow-inner shadow-neutral-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" className="fill-gray-400 stroke-gray-400 mr-1"><path d="M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z" /></svg>
                    <input className="rounded-full bg-transparent text-xl w-full" type="text" placeholder="Answer" />
                </div>
                <button className="bg-red-600 select-none py-1 rounded-full shadow-md shadow-gray-800 hover:cursor-pointer hover:bg-red-800 hover:shadow-none duration-500 transition-all font-semibold tracking-wider">Reset</button>
            </section>
            <div className="w-screen flex items-center justify-center">
                <Link href='/' className="py-4 text-3xl text-lime-300 font-[desmodus] tracking-widest">
                    Back
                </Link>
            </div>
        </section>
    </>
}
import Image from "next/image";
import { useRef, useState } from "react";
import { Ref } from "react";
import Login from "./login";
import Separator from "./separator";
import Accounts from "./accounts";
import Link from "next/link";

export default function Sidebar() {
    const sectionHTML: Ref<HTMLElement> = useRef()
    const [sidebar, setSidebar] = useState(false)

    const accountTypes = [
        { id: 1, label: "No Fee Checking", link: '' },
        { id: 2, label: "High Interest Checking", link: '' },
        { id: 3, label: "Secure Crypto Wallet", link: '' },
        { id: 4, label: "High Interest Saving", link: '' },
        { id: 5, label: "Roth IRA", link: '' },
        { id: 6, label: "401k", link: '' }
    ]
    const creditTypes = [
        { label: "Prometheus Fire", link: '' },
        { label: "Signature Plus", link: '' },
        { label: "Pillar", link: '' },
        { label: "Divinity", link: '' }
    ]
    const stockTypes = [
        { label: "Trading Platform", link: '' },
    ]
    const educationTypes = [
        { label: "Blog", link: '/blog' },
        { label: "Options Trading", link: '' },
        { label: "Stock Fundamentals", link: '' },
        { label: "Crypto Zone", link: '' },
    ]

    const openSidebar = () => {
        setSidebar(x => !x)
        sidebar ? sectionHTML.current.style.transform = '' :
            sectionHTML.current.style.transform = 'translateX(0%)'
    }
    return <>
        <section ref={sectionHTML} className={`w-48 transition-all duration-500 bg-slate-100 shadow-md shadow-slate-800 h-screen fixed z-50 self-start bg-gradient-to-bl from-gray-500  to-gray-900 text-white from-30%
           max-md:-translate-x-full `}
        >
            <Accounts>
                <h4 className="text-xl text-lime-400">Open Account</h4>
                <div className="flex flex-col">
                    {accountTypes.map((x, index) =>
                        <Link key={`account-${x.id}`} href={x.link} className="indent-4 hover:font-bold duration-500 transition-all">{x.label}</Link>
                    )}
                </div>
            </Accounts>
            <Separator></Separator>
            <Accounts>
                <h4 className="text-xl text-lime-400">Stocks & Crypto</h4>
                <div className="flex flex-col">
                    {stockTypes.map((x, index) =>
                        <Link key={`stocks-${index}`} href={x.link} className=" indent-4 hover:font-bold duration-500 transition-all">{x.label}</Link>
                    )}
                </div>
            </Accounts>
            <Separator></Separator>
            <Accounts>
                <h4 className="text-xl text-lime-400">Apply for Credit Card</h4>
                <div className="flex flex-col">
                    {creditTypes.map((x, index) =>
                        <Link key={index} href={x.link} className=" indent-4 hover:font-bold duration-500 transition-all">{x.label}</Link>
                    )}
                </div>
            </Accounts>
            <Separator></Separator>
            <section className="px-4 flex flex-col gap-2">
                <h4 className="text-xl text-lime-400">Education & Blog</h4>
                <div className="flex flex-col">
                    {educationTypes.map((x, index) =>
                        <Link key={index} href={x.link} className=" indent-4 hover:font-bold duration-500 transition-all">{x.label}</Link>
                    )}
                </div>
            </section>
        </section>
        <button onClick={() => openSidebar()} className={`fixed transition-all duration-500 self-start p-2 ${sidebar === true ? `hidden` : 'translate-x-0'} md:hidden z-10 rounded-e-md`}>
            <Image
                src="/menu.svg"
                alt="menu"
                className="hover:scale-x-125 transition-all duration-500"
                width={25}
                height={30}
            ></Image>
        </button>
    </>
}
import Link from "next/link";
import CustomInput from "../lib/components/input";
import { UserIcon, EnvelopeIcon, KeyIcon } from '@heroicons/react/24/outline'

export default function Registration() {
    const create = async (fd: FormData) => {
        'use server'
        console.dir('got here')
    }
    return <>
        <div className="flex flex-col gap-4 items-center justify-center h-full">
            <div className="flex flex-col">
                <h1 className="[font-size:50px] lg:[font-size:85px] lg:[line-height:115px] font-[desmodus] bg-clip-text bg-gradient-to-t text-transparent from-lime-200 to-lime-600 from-10% text-center tracking-widest">
                    Prometheus
                </h1>
                <p className="max-md:hidden text-center text-white tracking-widest text-xl">Taking your power back from the gatekeeping gods</p>

            </div>
            <form action={create} className="flex flex-col gap-4 items-center justify-center mt-20">
                <CustomInput beforeEl={<UserIcon className="w-6 text-slate-500" />} afterEl={null} inputOptions={{ type: 'text', placeholder: 'Username', name:'userName'}} />
                <CustomInput beforeEl={<EnvelopeIcon className="w-6 text-slate-500" />} afterEl={null} inputOptions={{ type: 'text', placeholder: 'Email', name: 'email' }} />
                <CustomInput beforeEl={<KeyIcon className="w-6 text-slate-500" />} afterEl={null} inputOptions={{ type: 'password', placeholder: 'Password', name: 'password' }} />
                <CustomInput beforeEl={<KeyIcon className="w-6 text-slate-500" />} afterEl={null} inputOptions={{ type: 'password', placeholder: 'Confirm Password', name: 'confirmPassword' }} />
                <button type="submit" className="text-2xl border-4 w-60 rounded-full mt-10 text-white font-extrabold shadow-md shadow-black pb-2 tracking-widest transition-all duration-500 hover:shadow-none">Join</button>
            </form>
            <p className="text-white text-xl [text-shadow:_black_2px_0_10px] tracking-wide">Already have an account? <Link href='/' className="font-semibold">Login</Link></p>
        </div>
    </>
}
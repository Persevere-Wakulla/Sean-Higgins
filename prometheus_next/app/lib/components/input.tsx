import { ReactElement } from "react"
import { InputOptions } from "../types/inputOptions"

export default function CustomInput({ inputOptions, beforeEl = null, afterEl = null }: { inputOptions: InputOptions, beforeEl: ReactElement | null, afterEl: ReactElement | null }) {
   return <>
        <div className="shadow-md shadow-slate-800 rounded-full">
            <div className="bg-white rounded-full px-4 py-1 shadow-inner shadow-neutral-700 flex items-center">
                {beforeEl && beforeEl}
                <input name={inputOptions.name} autoComplete={inputOptions.autoComplete} value={inputOptions.value} onChange={inputOptions.onChangeCB} className="rounded-full bg-transparent text-xl w-full" type={inputOptions.type} placeholder={inputOptions.placeholder} />
                {afterEl && afterEl}
            </div>
        </div>
    </>
}
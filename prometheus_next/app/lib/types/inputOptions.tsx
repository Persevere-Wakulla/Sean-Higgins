import { ChangeEventHandler } from "react"

export type InputOptions = {
    placeholder: string,
    type: string,
    name: string,
    value?: string,
    autoComplete?: string,
    onChangeCB?: ChangeEventHandler<HTMLInputElement>
}
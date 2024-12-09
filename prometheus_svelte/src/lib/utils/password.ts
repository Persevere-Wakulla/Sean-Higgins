import bcrypt from 'bcryptjs'

export const saltAndHashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(4, 10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
}

export const comparePassword = async(hash:string, original: string) => {
    const salt = await bcrypt.getSalt(hash);
    const compare = await bcrypt.compare()
}
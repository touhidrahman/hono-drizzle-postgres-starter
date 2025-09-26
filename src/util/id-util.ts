import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890ABCDEF', 10)
export const generateId = () => nanoid()

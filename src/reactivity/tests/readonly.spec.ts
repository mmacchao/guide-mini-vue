import { isReadonly, readonly, isProxy } from "../reactive"

describe('readonly', () => {
    it('happy path', () => {
        const obj = {foo: 1}
        const res = readonly(obj)
        expect(res).not.toBe(obj)
        expect(res.foo).toBe(1)
    })

    it('warn', () => {
        console.warn = jest.fn()
        const obj = readonly({age: 10})
        obj.age = 11
        expect(console.warn).toBeCalled()
    })

    it('isReadonly', () => {
        const original = {foo: 10, bar: {a: 10}}
        const warpper = readonly(original)
        expect(isReadonly(warpper)).toBe(true)
        expect(isReadonly(original)).toBe(false)
        expect(isReadonly(warpper.bar)).toBe(true)
        expect(isReadonly(original.bar)).toBe(false)
        expect(isProxy(warpper)).toBe(true)
    })
})
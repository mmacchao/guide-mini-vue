import { isReactive, reactive, isProxy } from "../reactive"
describe('reactive', () => {
    it('happy path', () => {
        const original = {foo: 1, bar: {age: 10}}
        const observed = reactive(original)
        expect(observed).not.toBe(original)
        expect(observed.foo).toBe(1)
        expect(isReactive(observed)).toBe(true)
        expect(isReactive(observed.bar)).toBe(true)
        expect(isReactive(original.bar)).toBe(false)
        expect(isReactive(original)).toBe(false)
        expect(isProxy(observed)).toBe(true)
    })
})
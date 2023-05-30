import { isReadonly, shallowReadonly } from "../reactive"

describe('shallowReadonly', () => {
    it('happy path', () => {
        const obj = {foo: 1, bar: {}}
        const wrapper = shallowReadonly(obj)
        expect(isReadonly(wrapper)).toBe(true)
        expect(isReadonly(wrapper.bar)).toBe(false)
    })

    it('warn', () => {
        console.warn = jest.fn()
        const obj = shallowReadonly({age: 10, bar: {foo: 1}})
        obj.age = 11
        expect(console.warn).toBeCalled()
        obj.bar.foo = 2
        expect(console.warn).toBeCalledTimes(1)
    })
})
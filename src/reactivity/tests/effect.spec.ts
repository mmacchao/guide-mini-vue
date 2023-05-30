import { effect, stop } from "../effect"
import { reactive } from "../reactive"
describe('effect', () => {
    it('happy path', () => {
        const user = reactive({age: 10})
        let nextAge
        effect(() => {
            nextAge = user.age + 1
        })
        expect(nextAge).toBe(11)

        // update
        user.age++
        expect(nextAge).toBe(12)

    })

    it('should return runner when run effect', () => {
        let foo = 10
        const runner = effect(() => {
            foo++
            return 'foo'
        })

        expect(foo).toBe(11)
        const res = runner()
        expect(foo).toBe(12)
        expect(res).toBe('foo')
    })

    it('scheduler', () => {
        let dummy
        let run
        const scheduler = jest.fn(() => {
            run = runner
        })
        const obj = reactive({foo: 1})
        const runner = effect(() => {
            dummy = obj.foo   
        }, {scheduler})
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)
        expect(dummy).toBe(1)
        run()
        expect(dummy).toBe(2)
    })
    // 停止依赖收集，执行runner继续依赖收集
    it('stop', () => {
        let dummy
        const obj = reactive({foo: 1})
        const runner = effect(() => {
            dummy = obj.foo
        })
        obj.foo = 2
        expect(dummy).toBe(2)
        stop(runner)
        obj.foo++
        expect(dummy).toBe(2)

        runner()
        expect(dummy).toBe(3)
    })
    it('onStop', () => {
        const onStop = jest.fn()
        const runner = effect(() => {

        }, {onStop})
        stop(runner)
        expect(onStop).toHaveBeenCalledTimes(1)
    })
})
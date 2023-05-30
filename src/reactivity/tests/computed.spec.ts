import { computed } from "../computed"
import { reactive } from "../reactive"

describe('computed', () => {
    it('happy path', () => {
        const user = reactive({age: 1})
        const age = computed(() => {
            return user.age
        })
        expect(age.value).toBe(1)
    })

    it('懒加载', () => {
        const user = reactive({age: 1})
        const getter = jest.fn(() => user.age)
        const age = computed(getter)
        expect(getter).not.toHaveBeenCalled()
        expect(age.value).toBe(1)
        expect(getter).toBeCalledTimes(1)

        // 被缓存
        age.value
        expect(getter).toBeCalledTimes(1)

        // 依赖变化后getter不会执行
        user.age = 2
        expect(getter).toBeCalledTimes(1)

        // now it should compute
        expect(age.value).toBe(2)
        expect(getter).toBeCalledTimes(2)

        // should not compute again
        user.age
        expect(getter).toBeCalledTimes(2)
    })
})
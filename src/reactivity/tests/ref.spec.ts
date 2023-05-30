import { effect } from "../effect"
import { reactive } from "../reactive"
import { isRef, proxyRef, ref, unRef } from "../ref"

describe('ref', () => {
    it('happy path', () => {
        const num = ref(1)
        expect(num.value).toBe(1)
    })

    it('should be reactive', () => {
        const num = ref(1)
        let dummy = 0
        let calls = 0
        effect(() => {
            calls++
            dummy = num.value
        })
        expect(calls).toBe(1)
        expect(dummy).toBe(1)
        num.value = 2
        expect(calls).toBe(2)
        expect(dummy).toBe(2)
        num.value = 2
        expect(calls).toBe(2)

    })

    it('nested value should ve reactive', () => {
        let original = {num: 1}
        const refObj = ref(original)
        let dummy
        let calls = 0
        effect(() => {
            calls++
            dummy = refObj.value.num
        })
        refObj.value.num = 2
        expect(calls).toBe(2)
        expect(dummy).toBe(2)
        refObj.value = original
        expect(calls).toBe(2)
        expect(dummy).toBe(2)
    })

    it('isRef', () => {
        const refObj = ref(1)
        const a = reactive({})
        expect(isRef(refObj)).toBe(true)
        expect(isRef(1)).toBe(false)
        expect(isRef(a)).toBe(false)
    })

    it('unRef', () => {
        const refObj = ref(1)
        expect(unRef(refObj)).toBe(1)
        expect(unRef(1)).toBe(1)
    })

    it('proxyRef', () => {
        const user = {
            foo: 1,
            bar: ref(2)
        }
        const proxyUser = proxyRef(user)
        expect(proxyUser.bar).toBe(2)

        proxyUser.bar = 3
        expect(user.bar.value).toBe(3)

        proxyUser.bar = ref(4)
        expect(user.bar.value).toBe(4)
        expect(proxyUser.bar).toBe(4)
    })
})
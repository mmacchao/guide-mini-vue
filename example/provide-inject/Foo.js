import { h, renderSlots, createTextVnode, getCurrentInstance, provide, inject } from "../../lib/guide-mini-vue.esm.js"
export const Foo2 = {
    name: 'Foo',
    setup() {
        provide('foo', 'foo 2')
    },
    render() {
        return h(Foo)
    }
}
export const Foo = {
    name: 'Foo',
    setup(props, { emit }) {
        const foo = inject('foo')
        return {
            foo,
        }
    },
    render() {
        return h('p', {},[h('p', {}, `foo: ${this.foo}`),])
    }
}
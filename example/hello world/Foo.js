import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
    name: 'Foo',
    setup(props, { emit }) {
        console.log(props)

        // props is shallow readonly
        // props.count++

        emit('add', 1, 2)
        emit('add-foo')
    },
    render() {
        const slotVnode = renderSlots(this.$slots, 'header', { age: 18 })
        console.log(slotVnode)
        console.log(this.$slots)
        return h('p', {},
            [
                slotVnode,
                h('p', {}, 'hi:' + this.count),
            ])
    }
}
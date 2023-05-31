import { h, renderSlots, createTextVnode, getCurrentInstance } from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
    name: 'Foo',
    setup(props, { emit }) {
        console.log(getCurrentInstance())
    },
    render() {
        
        return h('p', {},
            [
                createTextVnode('我是text节点'),
                h('p', {}, 'hi:' + this.count),
            ])
    }
}
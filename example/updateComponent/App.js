import { createTextVnode, h, ref } from "../../lib/guide-mini-vue.esm.js"
import { Child } from "./Child.js"
export const App = {
    name: 'App',
    setup() {
        const msg = ref(123)
        const count = ref(1)
        const changeChild = () => {
            msg.value += 1
        }
        const changeCount = () => {
            count.value += 1
        }

        return {
            msg,
            count,
            changeChild,
            changeCount,
        }
    },
    render() {
        return h('p', {},
            [
                h('button', { onClick: this.changeChild }, '改变child'),
                h(Child, {msg: this.msg}),
                h('button', {onClick: this.changeCount}, '改变count'),
                h('div', {}, this.count+'')
            ]
        )
    }
}
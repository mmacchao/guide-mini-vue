import { createTextVnode, h, ref } from "../../lib/guide-mini-vue.esm.js"
export const App = {
    name: 'App',
    setup() {
        const count = ref(0)
        return {
            count,
            handleClick() {
                console.log('click')
                count.value += 1
            }
        }
    },
    render() {
        return h('p', {}, [ h('button', {onClick: this.handleClick}, '点击按钮'), createTextVnode(`count: ${this.count}`)])
    }
}
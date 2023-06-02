import { createTextVnode, getCurrentInstance, h, nextTick, ref } from "../../lib/guide-mini-vue.esm.js"
export const App = {
    name: 'App',
    setup() {
        const count = ref(0)
        
        const instance = getCurrentInstance()
        const change = () => {
            for(let i = 0; i <= 99; i++) {
                count.value = i
            }
            console.log(instance)
            nextTick(() => {
                console.log(instance)
            })
        }
       

        return {
            count,
            change,
        }
    },
    render() {
        return h('p', {},
            [
                h('button', { onClick: this.change }, '改变count'),
                h('div', {}, this.count + '')
            ]
        )
    }
}
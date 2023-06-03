import { createTextVnode, h, ref } from "../../lib/guide-mini-vue.esm.js"
export const App = {
    name: 'App',
    setup() {
        const message = ref('mini-vue')
        return {
           message
        }
    },
    template: `<div>hi: {{message}}</div>`
}
import { h } from "../../lib/guide-mini-vue.esm.js"
window.self
export const App = {
    render() {
        window.self = this
        return h('div',
            {
                id: 'root',
                class: ['red'],
                onClick() {
                    console.log('click')
                }
            },
            // [h('p', {class: ['red']}, 'hi,'), h('p', {class: ['blue']},  'min vue')]
            'hi, ' + this.msg
        )
    },
    setup() {
        return {
            msg: 'mini-vue'
        }
    }
}
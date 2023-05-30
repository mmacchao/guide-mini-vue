import { h } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"
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
            ['hi, ' + this.msg,
            h(Foo, {
                count: 1, 
                onAdd(a, b) {
                    console.log('onAdd', a, b)
                },
                onAddFoo() {
                    console.log('onAddFoo')
                }
            })]
        )
    },
    setup() {
        return {
            msg: 'mini-vue'
        }
    }
}
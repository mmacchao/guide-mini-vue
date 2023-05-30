import { h } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"
window.self
export const App = {
    name: 'App',
    render() {
        const fooSlot = h('p', {}, 'i am slot')
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
            [
                h('p', {}, 'hi, ' + this.msg,),
                h(Foo,
                    {
                        count: 1,
                        onAdd(a, b) {
                            console.log('onAdd', a, b)
                        },
                        onAddFoo() {
                            console.log('onAddFoo')
                        }
                    },
                    {
                        header: props => h('div', {}, 'age: ' + props.age)
                    })
            ]
        )
    },
    setup() {
        return {
            msg: 'mini-vue'
        }
    }
}
import { h, getCurrentInstance, provide } from "../../lib/guide-mini-vue.esm.js"
import { Foo2 } from "./Foo.js"

export const App = {
    name: 'App',
    render() {
    
        return h('div',{}, [h(Foo2)])
    },
    setup() {
        provide('foo', 'foo app')
    }
}
import { h } from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
    setup(props) {
        console.log(props)
        
        // props is shallow readonly
        props.count++
    },
    render() {
        return h('p', {}, 'hi:' + this.count)
    }
}
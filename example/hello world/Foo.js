import { h } from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
    setup(props, {emit}) {
        console.log(props)
        
        // props is shallow readonly
        // props.count++
        
        emit('add', 1, 2)
        emit('add-foo')
    },
    render() {
        return h('p', {}, 'hi:' + this.count)
    }
}
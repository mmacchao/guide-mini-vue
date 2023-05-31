import { createTextVnode, h, ref } from "../../lib/guide-mini-vue.esm.js"
export const App = {
    name: 'App',
    setup() {
        const count = ref(0)
        const props = ref({foo: 'foo', bar: 'bar'})

        const change = () => {
            props.value.foo = 'foo new'
            console.log('change')
        }
        const change2 = () => {
            props.value.bar = null
        }
        const change3 = () => {
            props.value = {foo: 'foo'}
        }
        return {
            count,
            props,
            change,
            change2,
            change3,
        }
    },
    render() {
        return h('p', {...this.props},
            [
                h('button', { onClick: this.change }, '改变props'),
                h('button', { onClick: this.change2 }, '值置为空'),
                h('button', { onClick: this.change3 }, '删除props'),
                createTextVnode(`count: ${this.count}`)
            ]
        )
    }
}
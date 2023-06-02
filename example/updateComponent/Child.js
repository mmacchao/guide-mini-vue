import { h } from "../../lib/guide-mini-vue.esm.js"

export const Child = {
    setup() {

    },
    render() {
        return h('div', {}, this.msg+'')
    }
}
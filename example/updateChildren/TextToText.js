import { h, ref } from "../../lib/guide-mini-vue.esm.js"
const PrevText = 'prevText'
const NextText = 'new text'
export const TextToText = {
    setup() {
        const isChange = window.isChange = ref(false)
        return {
            isChange,
        }
    },
    render() {
        return this.isChange ? h('div', {}, NextText) : h('div', {}, PrevText)
    }
}
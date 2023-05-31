import {h, ref} from '../../lib/guide-mini-vue.esm.js'
const PrevText = [h('div', {}, 'array[0]' ), h('div', {}, 'array[1]')]
const NextText = 'new text'
export const ArrayToText = {
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
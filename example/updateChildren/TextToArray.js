import {h, ref} from '../../lib/guide-mini-vue.esm.js'
const NextText = [h('div', {}, 'array[0]' ), h('div', {}, 'array[1]')]
const PrevText = 'new text'
export const TextToArray = {
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
import {h, ref} from '../../lib/guide-mini-vue.esm.js'

// 新的比旧的长，长在右边
// const c1 = h('div', {}, [
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
// ])
// const c2 = h('div', {}, [
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
//     h('div', {key: 'C'}, 'C'),
//     h('div', {key: 'D'}, 'D'),
// ])

// 新的比旧的长，长在左边
// const c1 = h('div', {}, [
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
// ])
// const c2 = h('div', {}, [
//     h('div', {key: 'D'}, 'D'),
//     h('div', {key: 'C'}, 'C'),
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
// ])

// 新的比旧的短，左边少了
// const c1 = h('div', {}, [
//     h('div', {key: 'D'}, 'D'),
//     h('div', {key: 'C'}, 'C'),
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
// ])
// const c2 = h('div', {}, [
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
// ])
// 新的比旧的短，右边少了
// const c1 = h('div', {}, [
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
//     h('div', {key: 'D'}, 'D'),
//     h('div', {key: 'C'}, 'C'),
// ])
// const c2 = h('div', {}, [
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
// ])

// 其他情况
const c1 = h('div', {}, [
    h('div', {key: 'A'}, 'A'),
    h('div', {key: 'B'}, 'B'),
    h('div', {key: 'C'}, 'C'),
    h('div', {key: 'D'}, 'D'),
    h('div', {key: 'E'}, 'E'),
    h('div', {key: 'F'}, 'F'),
])
const c2 = h('div', {}, [
    h('div', {key: 'D'}, 'D'),
    h('div', {key: 'B'}, 'B'),
    h('div', {key: 'C'}, 'C'),
    h('div', {key: 'A'}, 'A'),
    h('div', {key: 'G'}, 'G'),
    h('div', {key: 'E'}, 'E'),
    h('div', {key: 'F'}, 'F'),
])


export const ArrayToArray = {
    setup() {
        const isChange = window.isChange = ref(false)
        return {
            isChange,
        }
    },
    render() {
        return this.isChange ? c2 : c1
    }
}
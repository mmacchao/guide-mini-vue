import { createTextVnode, h, ref } from "../../lib/guide-mini-vue.esm.js"
import { TextToText } from "./TextToText.js"
import { ArrayToText } from "./ArrayToText.js"
import { TextToArray } from "./TextToArray.js"
import { ArrayToArray } from "./ArrayToArray.js"
export const App = {
    name: 'App',
    setup() {
        
        return {
           
        }
    },
    render() {
        return h('div', {}, [
            createTextVnode('我是App'),
            // h(TextToText),
            // h(ArrayToText),
            // h(TextToArray)
            h(ArrayToArray)
        ])
    }
}
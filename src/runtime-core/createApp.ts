// import { render } from "./renderer"
import { createVNode } from "./vnode"

export function createAppAPI(render) {
    return function createApp(App) {
        return {
            mount(rootContainer) {
                const rootVnode = createVNode(App)
                render(rootVnode, rootContainer)
            }
        }
    }
}
// export function createApp(App) {
//     return {
//         mount(rootContainer) {
//             const rootVnode = createVNode(App)
//             render(rootVnode, rootContainer)
//         }
//     }
// }


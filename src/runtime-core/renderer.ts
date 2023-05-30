import { isObject } from "../reactivity/share/index"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
    patch(vnode, container)
}

export function patch(vnode, container) {
    if (typeof vnode.type === 'string') {
        processElement(vnode, container)
    } else if (isObject(vnode.type)) {
        processComponent(vnode, container)
    }

}

function processElement(vnode, container) {
    const el = document.createElement(vnode.type)

    vnode.el = el

    // handle children
    if(typeof vnode.children === 'string') {
        el.textContent = vnode.children
    } else if(Array.isArray(vnode.children)) {
       patchChildren(vnode.children, el)
    }

    // handle props
    for(let key in vnode.props) {
        el.setAttribute(key, vnode.props[key])
    }

    container.append(el)

}

function patchChildren(children, container) {
    children.forEach(childVnode => {
        patch(childVnode, container)
    })
}

function processComponent(vnode: any, container) {

    mountComponent(vnode, container)

}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode)
    setupComponent(instance)
    setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance, vnode, container) {
    const subTree = instance.render.call(instance.proxy)

    patch(subTree, container)
    
    // 组件的el要挂载子元素的根el
    vnode.el = subTree.el
}


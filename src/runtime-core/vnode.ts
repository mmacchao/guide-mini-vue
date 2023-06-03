import { isObject } from "../share/index"
import { ShapeFlags } from "./shapFlags"
export {
    createVNode as createElementVnode
}

export function createVNode(type, props?, children?) {
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapFlag: getShapFlag(type),
        key: props?.key,
        instance: null,
    }
    if(typeof children === 'string') {
        vnode.shapFlag |= ShapeFlags.TEXT_CHILDREN
    } else if(Array.isArray(children)) {
        vnode.shapFlag |= ShapeFlags.ARRAY_CHILDREN
    }

    // 组件加slots
    if(vnode.shapFlag & ShapeFlags.STATEFUL_COMPONENT) {
        if(typeof children === 'object') {
            vnode.shapFlag |= ShapeFlags.SLOT_CHILDREN
        }
    }

    return vnode
}

function getShapFlag(type) {
    return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT 
}

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export function createTextVnode(text) {
    return createVNode(Text, {}, text)
}
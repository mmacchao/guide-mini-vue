import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"

export function createComponentInstance(vnode) {
    const instance = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: null,
        emit: () => {},
        slots: {},
    }

    instance.emit = emit.bind(null, instance) as any
    return instance
}

export function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vnode.props)
    initSlots(instance, instance.vnode.children)

    setupStatefulComponent(instance)
}
function setupStatefulComponent(instance) {
    const Component = instance.type
    instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandlers)

    const {setup} = Component
    if(setup) {
        setCurrentInstance(instance)
        const setupResult = setup(shallowReadonly(instance.props), {emit: instance.emit})
        hanldeSetupResult(instance, setupResult)
        setCurrentInstance(null)
    }
}

function hanldeSetupResult(instance, setupResult: any) {
    if(typeof setupResult === 'object') {
        instance.setupState = setupResult
    }
    instance.render = instance.type.render

    finishComponentSetup()
}

function finishComponentSetup() {
    // throw new Error("Function not implemented.")
}

let currentInstance
export function getCurrentInstance() {
    return currentInstance
}

function setCurrentInstance(instance) {
    currentInstance = instance
}



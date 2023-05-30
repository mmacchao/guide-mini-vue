import { shallowReadonly } from "../reactivity/reactive"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance"

export function createComponentInstance(vnode) {
    return {
        vnode,
        type: vnode.type,
        setupState: {},
        props: null,
    }
}

export function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vnode.props)
    // initSlots()

    setupStatefulComponent(instance)
}
function setupStatefulComponent(instance) {
    const Component = instance.type
    instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandlers)

    const {setup} = Component
    if(setup) {
        const setupResult = setup(shallowReadonly(instance.props))
        hanldeSetupResult(instance, setupResult)
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


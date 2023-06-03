import { shallowReadonly } from "../reactivity/reactive"
import { proxyRef } from "../reactivity/ref"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"

export function createComponentInstance(vnode, parentComponent) {
    const instance = {
        vnode,
        next: null,
        type: vnode.type,
        setupState: {},
        props: null,
        emit: () => {},
        slots: {},
        parent: parentComponent || {},
        provides: (parentComponent && parentComponent.provides) ? parentComponent.provides : {},
        isMounted: false,
        subTree: {},
    
    }
    vnode.instance = instance

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
        instance.setupState = proxyRef(setupResult)
    }
    finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
    const Component = instance.type
    if(Component.render) {
        instance.render = Component.render
    } else if(Component.template && compiler) {
        instance.render = compiler(Component.template)
    }  
}

let currentInstance
export function getCurrentInstance() {
    return currentInstance
}

function setCurrentInstance(instance) {
    currentInstance = instance
}

let compiler
export function registerRuntimeCompiler(_compiler) {
    compiler = _compiler
}



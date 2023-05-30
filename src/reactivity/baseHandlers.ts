import { track, trigger } from "./effect"
import { FLAGS, reactive, readonly } from "./reactive"
import { extend, isObject } from "../share/index"


function createGetter(isReadonly = false, shallow = false) {
    return function(target, key) {
        if(key === FLAGS.IS_REACTIVE) {
            return !isReadonly
        } else if(key === FLAGS.IS_READONLY) {
            return isReadonly
        }
        let res = Reflect.get(target, key)
        if(shallow) {
            return res
        }
        if(isObject(res)) {
            res = isReadonly ? readonly(res) : reactive(res)
        }
        if(!isReadonly)
            track(target, key)
        return res
    }
}

function createSetter() {
    return  function(target, key, value) {
        const res = Reflect.set(target, key, value)
        trigger(target, key)
        return res
    }
}

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

export const mutableHandlers = {
    get,
    set,
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key: ${String(key)}不能被赋值，因为当前对象是readonly`, target)
        return true
    }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
})
import { isTracking, trackEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";
import { hasChanged, isObject } from "../share/index";

class RefImpl {
    private _value: any;
    dep: any
    private _rawValue: any
    __v_isRef = true
    constructor(value) {
        this._rawValue = value
        this._value = convert(value)
        this.dep = new Set()
    }

    get value() {
        trackRefEffect(this)
        return this._value
    }

    set value(value) {
        if(hasChanged(value, this._rawValue)) {
            this._value = convert(value)
            this._rawValue = value
            triggerEffect(this.dep)
        }
        
    }
}

export function isRef(ref) {
    return !!ref.__v_isRef
}
export function unRef(ref) {
    return isRef(ref) ? ref.value : ref
}

function trackRefEffect(ref) {
    if(isTracking()) {
        trackEffect(ref.dep)
    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value
}

export function ref(value) {
    return new RefImpl(value)
}

export function proxyRef(objectWithRef) {
    return new Proxy(objectWithRef, {
        get(target, key) {
            return unRef(Reflect.get(target, key))
        },
        set(target, key, value) {
            if(isRef(target[key]) && !isRef(value)) {
                return target[key].value = value
            } else {
                return Reflect.set(target, key, value)
            }
        }
    })
}
import { ReactiveEffect } from "./effect"

class ComputedRefImpl {
    private _getter: any
    _dirty: boolean = true
    private _value: any
    private _effect: ReactiveEffect
    constructor(getter) {
        this._getter = getter

        // 维护一个effect用于监听getter的依赖，并在依赖变化时做一些自定义事情而不是执行getter
        this._effect = new ReactiveEffect(getter, () => {
            this._dirty = true
        })
    }

    get value() {
        if(this._dirty) {
            this._value = this._effect.run()
            this._dirty = false
        }
        return this._value
    }
}

export function computed(getter) {
    return new ComputedRefImpl(getter)
}
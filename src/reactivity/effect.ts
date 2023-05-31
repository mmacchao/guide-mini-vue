let activeEffect
let shouldTrack = false
export class ReactiveEffect {
    private _fn: any
    deps = []
    active = true
    onStop?: () => void
    constructor(fn, public scheduler?) {
        this._fn = fn
    }
    run() {
        if (!this.active) {
            return this._fn()
        }
        shouldTrack = true
        activeEffect = this
        const result = this._fn()
        shouldTrack = false
        return result
    }
    stop() {
        this.deps.forEach((dep: any) => {
            dep.delete(this)
        });
        this.active = false
        this.onStop?.()
    }
}

const targetMap = new Map()
export function track(target, key) {
    if (!isTracking()) return
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }
    trackEffect(dep)

}

export function trackEffect(dep) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
}

export function isTracking() {
    return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key) {
    const depsMap = targetMap.get(target)
    const dep = depsMap.get(key)
    if(dep?.size) {
        triggerEffect(dep)
    }
    
}

export function triggerEffect(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else
            effect.run()
    }
}


export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn)
    Object.assign(_effect, options)

    _effect.run()
    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}

export function stop(runner) {
    runner.effect.stop()
}
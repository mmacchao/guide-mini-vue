import { getCurrentInstance } from "./component";

export function provide(key, value) {
    const currentInstance = getCurrentInstance()
    let provides = currentInstance.provides
    if(provides === currentInstance.parent.provides) {
        provides = currentInstance.provides = Object.create(provides)
    }
    provides[key] = value

}

export function inject(key, defaultValue) {
    const currentInstance = getCurrentInstance()
    if(currentInstance) {
        const parentProvides = currentInstance.parent.provides
       if(key in parentProvides) {
        return parentProvides[key]
       } else if(defaultValue) {
        if(typeof defaultValue === 'function') {
            return defaultValue()
        } 
        return defaultValue
       }
    }
    
}
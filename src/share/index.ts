export function isObject(value) {
    return value !== null && typeof value === 'object'
}

export const extend = Object.assign

export function hasChanged(val, oldValue) {
    return !Object.is(val, oldValue)
}

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

export const camelize  = (str: string) => {
    return str.replace(/-(\w)/g, (_, c: string) => {
        return c ? c.toUpperCase() : ''
    })
}

// add -> Add
export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

export const toHandlerKey = str => str ? ('on'+capitalize(str)) : ''
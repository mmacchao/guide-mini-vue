export function isObject(value) {
    return value !== null && typeof value === 'object'
}

export const extend = Object.assign

export function hasChanged(val, oldValue) {
    return !Object.is(val, oldValue)
}

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)
export function isObject(value) {
    return value !== null && typeof value === 'object'
}

export const extend = Object.assign

export function hasChanged(val, oldValue) {
    return !Object.is(val, oldValue)
}
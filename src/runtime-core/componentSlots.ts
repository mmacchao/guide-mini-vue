import { ShapeFlags } from "./shapFlags"

export function initSlots(instance, children) {
    const { vnode } = instance
    if (vnode.shapFlag & ShapeFlags.SLOT_CHILDREN) {
        instance.slots = normalizeObjectSlots(children)
    }

}


// 把slots里面的每个slot变成函数形式
function normalizeObjectSlots(children) {
    const slots = {}
    for (let key in children) {
        const value = children[key]
        slots[key] = props => normalizeSlotValue(value(props))
    }
    return slots
}

function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value]
}
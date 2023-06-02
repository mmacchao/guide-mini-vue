import { createRenderer } from "../runtime-core/renderer";

function createElement(type) {
  return document.createElement(type)
}

function patchProp(el, key, prevVal, nextVal) {
  // handle event
  const isOn = key => /^on[A-Z]/.test(key)
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase()
    el.addEventListener(event, nextVal)
  } else {
    if(nextVal === null || nextVal === undefined) {
      el.removeAttribute(key)
    } else if(prevVal !== nextVal) {
      el.setAttribute(key, nextVal)
    }
  }
}

function insert(child, parent, anchor) {
  parent.insertBefore(child, anchor)
}

function remove(el) {
  const parent = el.parentNode
  if(parent) {
    parent.removeChild(el)
  }
}

function setElementText(el, text) {
  el.textContent = text
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText,
})

export function createApp(...args) {
  return renderer.createApp(...args)
}


export * from '../runtime-core/index'

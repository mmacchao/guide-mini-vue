import {createRenderer} from "../runtime-core/renderer";

function createElement(type) {
  return document.createElement(type)
}

function patchProps(el, props) {
  for (let key in props) {
      const val = props[key]
      // handle event
      const isOn = key => /^on[A-Z]/.test(key)
      if (isOn(key)) {
          const event = key.slice(2).toLowerCase()
          el.addEventListener(event, val)
      } else {
          el.setAttribute(key, val)
      }

  }
}

function insert(el, container) {
  container.append(el)
}

const renderer: any = createRenderer({
  createElement,
  patchProps,
  insert,
})

export function createApp(...args ) {
  return renderer.createApp(...args)
}


export * from '../runtime-core/index'

import { isObject } from "../share/index"
import { createComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from "./shapFlags"
import { Fragment, Text } from "./vnode"
import {createAppAPI} from "./createApp";

export function createRenderer(options) {

  // const options = {}
  const {
    createElement,
    patchProps,
    insert,
  } = options

  function render(vnode, container) {
    patch(vnode, container, null)
  }

  function patch(vnode, container, parentComponent) {
    switch (vnode.type) {
      case Fragment:
        processFragment(vnode, container, parentComponent)
        break
      case Text:
        processText(vnode, container)
        break
      default:
        if (vnode.shapFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent)
        } else if (vnode.shapFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parentComponent)
        }
    }



  }

  function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent)
  }

  function processFragment(vnode, container, parentComponent) {
    patchChildren(vnode.children, container, parentComponent)
  }
  function processText(vnode, container) {
    const el = vnode.el = document.createTextNode(vnode.children)
    container.append(el)
  }

  function mountElement(vnode, container, parentComponent) {
    // const el = vnode.el = document.createElement(vnode.type)
    const el = vnode.el = createElement(vnode.type)

    vnode.el = el

    // handle children
    if (vnode.shapFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = vnode.children
    } else if (vnode.shapFlag & ShapeFlags.ARRAY_CHILDREN) {
      patchChildren(vnode.children, el, parentComponent)
    }

    // handle props
    patchProps(el, vnode.props)
    // for (let key in vnode.props) {
    //     const val = vnode.props[key]
    //     // handle event
    //     const isOn = key => /^on[A-Z]/.test(key)
    //     if (isOn(key)) {
    //         const event = key.slice(2).toLowerCase()
    //         el.addEventListener(event, val)
    //     } else {
    //         el.setAttribute(key, val)
    //     }
    //
    // }

    insert(el, container)
    // container.append(el)
  }

  function patchChildren(children, container, parentComponent) {
    children.forEach(childVnode => {
      patch(childVnode, container, parentComponent)
    })
  }

  function processComponent(vnode: any, container, parentComponent) {

    mountComponent(vnode, container, parentComponent)

  }
  function mountComponent(vnode, container, parentComponent) {
    const instance = createComponentInstance(vnode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, vnode, container)
  }

  function setupRenderEffect(instance, vnode, container) {
    const subTree = instance.render.call(instance.proxy)

    patch(subTree, container, instance)

    // 组件的el要挂载子元素的根el
    vnode.el = subTree.el
  }

  return {
    createApp: createAppAPI(render)
  }
}


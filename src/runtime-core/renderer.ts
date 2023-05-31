import { hasOwn, isObject } from "../share/index"
import { createComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from "./shapFlags"
import { Fragment, Text } from "./vnode"
import { createAppAPI } from "./createApp";
import { effect } from "../reactivity/effect";

export function createRenderer(options) {

  // const options = {}
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options

  function render(vnode, container) {
    patch(null, vnode, container, null)
  }

  function patch(n1, n2, container, parentComponent) {
    switch (n2.type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (n2.shapFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
        } else if (n2.shapFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
    }



  }

  function processElement(n1, n2, container, parentComponent) {
    if(!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container, parentComponent)
    }
    
  }

  function processFragment(n1, n2, container, parentComponent) {
    mountChildren(n2.children, container, parentComponent)
  }
  function processText(n1, n2, container) {
    const el = n2.el = document.createTextNode(n2.children)
    container.append(el)
  }

  function mountElement(vnode, container, parentComponent) {
    // const el = vnode.el = document.createElement(vnode.type)
    const el = vnode.el = hostCreateElement(vnode.type)

    vnode.el = el

    // handle children
    if (vnode.shapFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, vnode.children)
    } else if (vnode.shapFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent)
    }

    // handle props
    if (isObject(vnode.props)) {
      for (let key in vnode.props) {
        hostPatchProp(el, key, null, vnode.props[key])
      }
    }


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

    hostInsert(el, container)
    // container.append(el)
  }

  function patchElement(n1, n2, container, parentComponent) {
    const el = n2.el = n1.el
    patchChildren(el, n1, n2, parentComponent)
    patchProps(el, n1.props || {}, n2.props || {})
  }

  function patchChildren(el, n1, n2, parentComponent) {
    const prevShapFlag = n1.shapFlag
    const {shapFlag} = n2
    if(shapFlag & ShapeFlags.TEXT_CHILDREN) {
      if(prevShapFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(n1.children)
      } 
      hostSetElementText(el, n2.children)
    } else {
      if(prevShapFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(el, '')
        mountChildren(n2.children, el, parentComponent)
      }
    }
  }
  function unmountChildren(children) {
    children.forEach(({el}) => {
      hostRemove(el)
    })
  }

  function patchProps(el, prevProps, newProps) {
    for(const key in newProps) {
      const prevProp = prevProps[key]
      const nextProp = newProps[key]
      if(nextProp !== prevProp) {
        hostPatchProp(el, key, prevProp, nextProp)
      }
    }

    for(const key in prevProps) {
      if(!hasOwn(newProps, key)) {
        hostPatchProp(el, key, prevProps[key], null)
      }
    }


  }

  function mountChildren(children, container, parentComponent) {
    children.forEach(childVnode => {
      patch(null, childVnode, container, parentComponent)
    })
  }

  function processComponent(n1, n2: any, container, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }
  function mountComponent(n2, container, parentComponent) {
    const instance = createComponentInstance(n2, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, n2, container)
  }

  function setupRenderEffect(instance, vnode, container) {

    effect(() => {
      if (!instance.isMounted) {
        const subTree = instance.subTree = instance.render.call(instance.proxy)

        patch(null, subTree, container, instance)

        // 组件的el要挂载子元素的根el
        vnode.el = subTree.el
        instance.isMounted = true
      } else {
        const subTree = instance.render.call(instance.proxy)
        const prevSubTree = instance.subTree
        patch(prevSubTree, subTree, container, instance)
      }

    })

  }

  return {
    createApp: createAppAPI(render)
  }
}


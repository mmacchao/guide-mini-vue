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
    patch(null, vnode, container, null, null)
  }

  function patch(n1, n2, container, parentComponent, anchor) {
    switch (n2.type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (n2.shapFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor)
        } else if (n2.shapFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
    }



  }

  function processElement(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor)
    } else {
      patchElement(n1, n2, parentComponent, anchor)
    }

  }

  function processFragment(n1, n2, container, parentComponent) {
    mountChildren(n2.children, container, parentComponent)
  }
  function processText(n1, n2, container) {
    const el = n2.el = document.createTextNode(n2.children)
    container.append(el)
  }

  function mountElement(vnode, container, parentComponent, anchor) {
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

    hostInsert(el, container, anchor)
    // container.append(el)
  }

  function patchElement(n1, n2, parentComponent, anchor) {
    const el = n2.el = n1.el
    patchChildren(el, n1, n2, parentComponent)
    patchProps(el, n1.props || {}, n2.props || {})
  }

  function patchChildren(container, n1, n2, parentComponent) {
    const prevShapFlag = n1.shapFlag
    const { shapFlag } = n2
    if (shapFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(n1.children)
      }
      hostSetElementText(container, n2.children)
    } else {
      if (prevShapFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
        mountChildren(n2.children, container, parentComponent)
      } else {
        patchKeyedChildren(n1.children, n2.children, container, parentComponent)
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentComponent) {
    let e1 = c1.length - 1
    let e2 = c2.length - 1
    let i = 0

    // 左端对比
    while (i <= e1 && i <= e2) {
      if (isSameVnodeType(c1[i], c2[i])) {
        patch(c1[i], c2[i], container, parentComponent, null)
      } else {
        break
      }
      i++
    }

    // 右端对比
    while (i <= e1 && i <= e2) {
      if (isSameVnodeType(c1[e1], c2[e2])) {
        patch(c1[e1], c2[e2], container, parentComponent, null)
      } else {
        break
      }
      e1--
      e2--
    }

    // new children是在old children基础上左增或右增
    if (i > e1) {
      if (i <= e2) {
        // i超出了c1的边界，就全是append
        const anchor = c1[i] ? c1[i].el : null
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor)
          i++
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    } else {
      // 中间对比
      let s1 = i
      let s2 = i
      const toBePatched = e2 - s2 + 1
      const keyToNewIndexMap = new Map()
      const newIndexToOldIndexMap = new Array(toBePatched)
      for(let i = 0; i < toBePatched; i++) {
        newIndexToOldIndexMap[i] = 0
      }

      for(let i = s2; i <= e2; i++) {
        const nextChild = c2[i]
        keyToNewIndexMap.set(nextChild.key, i)
      }

      for(let i = s1; i <= e1; i++) {
        const prevChild = c1[i]

        let newIndex 
        if(prevChild.key !== null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          for(let j = s2; j < e2; j++) {
            if(isSameVnodeType(prevChild, c2[j])) {
              newIndex = j
              break
            }
          }
        }
        if(newIndex === undefined) {
          hostRemove(prevChild.el)
        } else {
          // i + 1来规避0值，0值的意义表示未匹配上
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          patch(prevChild, c2[newIndex], container, parentComponent, null)
        }
      }
      
      // 最长子序列算法，算出哪些节点不需要移动
      const increasingNewIndexSequence = getSequence(newIndexToOldIndexMap)
      let j = increasingNewIndexSequence.length - 1
      for(let i = toBePatched - 1; i >= 0; i--) {
        if( i !== increasingNewIndexSequence[j]) {
          // console.log('dom移动位置')
          // abcdef
          // dbcagef
          // 31200 -> 42310  newIndexToOldIndexMap -> getSequence -> [1,2]
          // 不用seq算法，那么就有执行4次dom移动，有了算法，执行2次即可
          // sequence [1,2]
          // toBePatched = 4
          // i = 3; j = 1; seq[j] = 2; 移动dom到后面一个前面,e的真实EIndex=i+s2+1, 只要EIndex不越界就是指定位置插入，否则直接在列表最后插入即可； j = 1
          // i = 2; j = 1; seq[j] = 2; j = 0
          // i = 1; j = 0; seq[j] = 1; j = -1
          // i = 0; j = -1; seq[j] = undefined; 移动dom到b的前面，b的Index=i+s2+1
          const nextIndex = i + s2
          const nextChild = c2[nextIndex]
          const anchor = nextIndex < c2.length - 1 ? c2[nextIndex+1].el : null
          if(newIndexToOldIndexMap[i] === 0) {
            // 新增
            patch(null, nextChild, container, parentComponent, anchor);
          } else {
            hostInsert(nextChild.el, container, anchor)
          }
          
        } else {
          j--
        }
      }
      
      function getSequence(arr: number[]): number[] {
        const p = arr.slice();
        const result = [0];
        let i, j, u, v, c;
        const len = arr.length;
        for (i = 0; i < len; i++) {
          const arrI = arr[i];
          if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
              p[i] = j;
              result.push(i);
              continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
              c = (u + v) >> 1;
              if (arr[result[c]] < arrI) {
                u = c + 1;
              } else {
                v = c;
              }
            }
            if (arrI < arr[result[u]]) {
              if (u > 0) {
                p[i] = result[u - 1];
              }
              result[u] = i;
            }
          }
        }
        u = result.length;
        v = result[u - 1];
        while (u-- > 0) {
          result[u] = v;
          v = p[v];
        }
        return result;
      }
      // const keyMap = {}
      // c2.forEach(n => {
      //   keyMap[n.key] = n
      // })





      // 先删
      // const newC1: any = []
      // let j = i
      // while (j <= e1) {
      //   if (!keyMap[c1[j].key]) {
      //     hostRemove(c1[j].el)
      //   } else {
      //     newC1.push(c1[j])
      //   }
      //   j++
      // }

      // patchKeyedChildren(newC1, c2, container, parentComponent)

      // const keyMap2 = {}
      // c1.forEach(n => {
      //   keyMap2[n.key] = n
      // })

      // // i超出了c1的边界，就全是append
      // // const anchor = c1[i] ? c1[i].el : null
      // j = i
      // while (j <= e2) {
      //   let el = keyMap2[c2[j].key]?.el
      //   if(el) {
      //     hostInsert(el, container, null)
      //   } else
      //     patch(null, c2[j], container, parentComponent, null)
      //   j++
      // }

    }






  }

  function isSameVnodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key
  }

  function unmountChildren(children) {
    children.forEach(({ el }) => {
      hostRemove(el)
    })
  }

  function patchProps(el, prevProps, newProps) {
    for (const key in newProps) {
      const prevProp = prevProps[key]
      const nextProp = newProps[key]
      if (nextProp !== prevProp) {
        hostPatchProp(el, key, prevProp, nextProp)
      }
    }

    for (const key in prevProps) {
      if (!hasOwn(newProps, key)) {
        hostPatchProp(el, key, prevProps[key], null)
      }
    }


  }

  function mountChildren(children, container, parentComponent) {
    children.forEach(childVnode => {
      patch(null, childVnode, container, parentComponent, null)
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

        patch(null, subTree, container, instance, null)

        // 组件的el要挂载子元素的根el
        vnode.el = subTree.el
        instance.isMounted = true
      } else {
        const subTree = instance.render.call(instance.proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree
        subTree.el = prevSubTree
        patch(prevSubTree, subTree, container, instance, null)
      }

    })

  }

  return {
    createApp: createAppAPI(render)
  }
}


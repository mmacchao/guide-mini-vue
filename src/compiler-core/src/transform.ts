import { NodeTypes } from "./ast"
import { CREATE_VNODE, TO_DISPLAY_STRING } from "./runtimeHelpers"

export function transform(root, options = {}) {
    const context = createTransformContext(root, options)
    traverseNode(root, context)
    createRootCodegen(root)
    root.helpers = [...context.helpers.keys()]
    return root
}

function createRootCodegen(root) {
    const child = root.children[0]
    if(child.type === NodeTypes.ELEMENT) {
        root.codegenNode = child.codegenNode
    } else {
        root.codegenNode = child
    }
}

function createTransformContext(root: any, options: any) {
    root.type = NodeTypes.ROOT
    const context: any = {
        root,
        nodeTransforms: options.nodeTransforms || [],
        helpers: new Map(),
        addHelper(helper) {
            context.helpers.set(helper, 1)
        }
    }
    return context
}
function traverseNode(node: any, context) {
    const onExitFns: any = []
    context.nodeTransforms.forEach(plugin => {
        const onExit = plugin(node, context)
        if(onExit) onExitFns.push(onExit)
    })

    switch(node.type) {
        case NodeTypes.INTERPOLATION:
            context.addHelper(TO_DISPLAY_STRING)
            break
        case NodeTypes.ROOT:
        case NodeTypes.ELEMENT:
            traversChildren(node, context)
            // context.addHelper(CREATE_VNODE)

            break
        default:
            break
    }

    let i = onExitFns.length
    while(i--) {
        onExitFns[i]()
    }

 
   
}


function traversChildren(node, context) {
    if(node.children?.length) {
        node.children.forEach(childNode => {
            traverseNode(childNode, context)
        })
    }
}

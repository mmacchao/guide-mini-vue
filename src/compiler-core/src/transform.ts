import { NodeTypes } from "./ast"

export function transform(root, options = {}) {
    const context = createTransformContext(root, options)
    traverseNode(root, context)
    root.codegenNode = root.children[0]
    root.helpers = context.helpers.keys()
    return root
}

function createTransformContext(root: any, options: any) {
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
    switch(node.type) {
        case NodeTypes.INTERPOLATION:
            context.addHelper('displayString')
            break
        default:
            break
    }

    context.nodeTransforms.forEach(plugin => {
        plugin(node)
    })
    if(node.children) {
        node.children.forEach(childNode => {
            traverseNode(childNode, context)
        })
    }
}


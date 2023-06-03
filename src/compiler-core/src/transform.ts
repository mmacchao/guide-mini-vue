export function transform(root, options = {}) {
    const context = createTransformContext(root, options)
    traverseNode(root, context)
    return root
}

function createTransformContext(root: any, options: any) {
    return {
        root,
        nodeTransforms: options.nodeTransforms || []
    }
}
function traverseNode(node: any, context) {
    context.nodeTransforms.forEach(plugin => {
        plugin(node)
    })
    if(node.children) {
        node.children.forEach(childNode => {
            traverseNode(childNode, context)
        })
    }
}


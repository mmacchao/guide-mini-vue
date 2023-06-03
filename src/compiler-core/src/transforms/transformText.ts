import { NodeTypes } from "../ast"

export function transfromText(node) {
    return function () {
        function isText(node) {
            return node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION
        }

        if (node.type === NodeTypes.ELEMENT && node.children) {
            let currentContainer
            const children = node.children
            for (let i = 0; i < children.length; i++) {
                if (isText(children[i])) {
                    for (let j = i + 1; j < children.length; j++) {
                        const nextNode = children[j]
                        if (isText(nextNode)) {
                            if (!currentContainer) {
                                currentContainer = children[i] = {
                                    type: NodeTypes.COMPUND_EXPRESSION,
                                    children: [children[i]]
                                }
                            }
                            currentContainer.children.push(' + ')
                            currentContainer.children.push(nextNode)
                            children.splice(j, 1)
                            j--
                        } else {
                            break
                        }

                    }
                }

            }
        }
    }

}
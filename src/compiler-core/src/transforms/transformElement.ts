import { NodeTypes } from "../ast";
import { CREATE_VNODE, runtimeHelpersMap } from "../runtimeHelpers";

export function transfromElement(node, context) {
    return function () {
        if (node.type === NodeTypes.ELEMENT) {
            context.addHelper(CREATE_VNODE)
            const vnodeTag = node.tag
            let vnodeProps;
            const children = node.children
            let vnodeChildren = children
            const vnodeElement = {
                type: NodeTypes.ELEMENT,
                tag: vnodeTag,
                props: vnodeProps,
                children: vnodeChildren,
            }
            node.codegenNode = vnodeElement
        }
    }
}
import { NodeTypes } from "./ast";
import { CREATE_VNODE, runtimeHelpersMap } from "./runtimeHelpers";

export function transfromElement(node, context) {
    if(node.type === NodeTypes.ELEMENT) {
        context.addHelper(CREATE_VNODE)
    }
}
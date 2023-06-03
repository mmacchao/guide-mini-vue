import { NodeTypes } from "./ast";

export function transformExpression(node) {
    if(node.type === NodeTypes.SIMPLE_EXPRESSION) {
        node.content = `_ctx.${node.content}`
    }
}
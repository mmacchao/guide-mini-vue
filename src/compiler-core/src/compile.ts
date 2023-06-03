import { generate } from "./codegen"
import { baseParse } from "./parse"
import { transform } from "./transform"
import { transfromElement } from "./transforms/transformElement"
import { transformExpression } from "./transforms/transformExpression"
import { transfromText } from "./transforms/transformText"

export function baseCompile(template) {
    const ast = baseParse(template)

    return generate(transform(ast, {
        nodeTransforms: [transformExpression, transfromElement, transfromText]
    }))
}
import { NodeTypes } from "../src/ast"
import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"
import { transform } from "../src/transform"
import { transfromElement } from "../src/transforms/transformElement"
import { transformExpression } from "../src/transforms/transformExpression"
import { transfromText } from "../src/transforms/transformText"

describe('codegen', () => {
    it('string', () => {
        const content = 'hi'
        const ast = baseParse(content)

        const {code} = generate(transform(ast))
        expect(code).toMatchSnapshot()
    })

    it('interpolation', () => {
        const content = '{{message}}'
        const ast = baseParse(content)

        const {code} = generate(transform(ast, {
            nodeTransforms: [transformExpression]
        }))
        expect(code).toMatchSnapshot()
    })

    it('element', () => {
        const content = '<div></div>'
        const ast = baseParse(content)

        const {code} = generate(transform(ast, {
            nodeTransforms: [transfromElement]
        }))
        expect(code).toMatchSnapshot()
    })

    it('联合类型', () => {
        const content = '<div>hi: {{message}}</div>'
        const ast = baseParse(content)

        const {code} = generate(transform(ast, {
            nodeTransforms: [transformExpression, transfromElement, transfromText]
        }))
        expect(code).toMatchSnapshot()
    })
})
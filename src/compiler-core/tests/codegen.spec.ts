import { NodeTypes } from "../src/ast"
import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"
import { transform } from "../src/transform"
import { transfromElement } from "../src/transformElement"
import { transformExpression } from "../src/transformExpression"

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
})
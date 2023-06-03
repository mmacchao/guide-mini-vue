import { NodeTypes } from "../src/ast"
import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"
import { transform } from "../src/transform"
import { transformExpression } from "../src/transformExpression"

describe('codegen', () => {
    it('string', () => {
        const content = 'hi'
        const ast = baseParse(content)

        const {code} = generate(transform(ast))
        expect(code).toMatchSnapshot()
    })

    it.only('interpolation', () => {
        const content = '{{message}}'
        const ast = baseParse(content)

        const {code} = generate(transform(ast, {
            nodeTransforms: [transformExpression]
        }))
        expect(code).toMatchSnapshot()
    })
})
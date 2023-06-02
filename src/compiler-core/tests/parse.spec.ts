import { NodeTypes } from "../src/ast"
import { baseParse } from "../src/parse"

describe('parse', () => {
    it('', () => {
        // expect(true).toBe(true)
        const str = '{{message}}'
        const ast = baseParse(str)
        expect(ast.children[0]).toStrictEqual({
            type: NodeTypes.INTERPOLATION,
            content: {
                type: NodeTypes.SIMPLE_EXPRESSION,
                content: 'message',
            }
        })
    })
})
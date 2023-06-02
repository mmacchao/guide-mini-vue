import { NodeTypes } from "../src/ast"
import { baseParse } from "../src/parse"

describe('parse', () => {
    it('interpolation解析', () => {
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

    it('element解析', () => {
        const content = '<div></div>'
        const ast = baseParse(content)
        expect(ast.children[0]).toStrictEqual({
            type: NodeTypes.ELEMENT,
            tag: 'div',
            // content: {
            //     type: NodeTypes.SIMPLE_EXPRESSION,
            //     content: '你好'
            // }
        })
    })

    it('text', () => {
        const content = 'some text'
        const ast = baseParse(content)
        expect(ast.children[0]).toStrictEqual({
            type: NodeTypes.TEXT,
            content: 'some text',
        })
    })
})
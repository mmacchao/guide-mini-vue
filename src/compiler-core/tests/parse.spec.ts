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

    it('three types', () => {
        const content = '<p>hi:{{message}}</p>'
        const ast = baseParse(content)
        expect(ast.children[0]).toStrictEqual({
            type: NodeTypes.ELEMENT,
            tag: 'p',
            children: [
                {
                    type: NodeTypes.TEXT,
                    content: 'hi:',
                },
                {
                    type: NodeTypes.INTERPOLATION,
                    content: {
                        type: NodeTypes.SIMPLE_EXPRESSION,
                        content: 'message'
                    }
                }
            ]
        })
    })

    
})

test('nested elements', () => {
    const content = '<p><div>hi</div>{{message}}</p>'
    const ast = baseParse(content)
    expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: 'p',
        children: [
            {
                type: NodeTypes.ELEMENT,
                tag: 'div',
                children: [
                    {
                        type: NodeTypes.TEXT,
                        content: 'hi',
                    }
                ]
            },
            {
                type: NodeTypes.INTERPOLATION,
                content: {
                    type: NodeTypes.SIMPLE_EXPRESSION,
                    content: 'message'
                }
            }
        ]
    })
})

test('no end tag should throw error', () => {
    const content = '<div><span></div>'
    expect(() => {
        baseParse(content)
    }).toThrow('缺失结束标签：span')
})


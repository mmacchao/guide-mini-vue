import { NodeTypes } from "../src/ast"
import { baseParse } from "../src/parse"
import { transform } from "../src/transform"

describe('transform', () => {
    it('happy path', () => {
        const content = '<div>hi:</div>'
        const plugin = node => {
            if(node.type === NodeTypes.TEXT) {
                node.content += 'mini-vue'
            }
        }
        const result: any = transform(baseParse(content), {
            nodeTransforms: [plugin]
        })
        expect(result.children[0].children[0].content).toBe('hi:mini-vue')
    })
})
import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"
import { transform } from "../src/transform"

describe('codegen', () => {
    it.only('happy path', () => {
        const content = 'hi'
        const ast = baseParse(content)

        const {code} = generate(transform(ast))
        expect(code).toMatchSnapshot()
    })
})
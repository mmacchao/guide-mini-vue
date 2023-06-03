export function generate(ast) {
    const node = ast.codegenNode
    const context = createCodegenContext()
    const {push} = context
    const functionName = 'render'
    const args = ['_ctx', '_cache']
    const signature = args.join(',')
    push('return function ')
    push(functionName)
    push(`(${signature})`)
    push('{ return ')
    genCode(node, context)
    push('}')

    return {
        code: context.code,
    }
}

function createCodegenContext() {
    const context = {
        code: '',
        push(str) {
            context.code += str
        }
    }
    return context
}
function genCode(node: any, context: any) {
    const {push} = context
    push(`'${node.content}'`) 
}


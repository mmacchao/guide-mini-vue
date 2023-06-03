import { NodeTypes } from "./ast"

export function generate(ast) {
    const node = ast.codegenNode
    const context = createCodegenContext()
    const {push} = context

    const VueBinging = 'Vue'
    const aliasHelper = s => `${s}:_${s}`
    push(`const { ${[...ast.helpers].map(aliasHelper).join(',')} } = ${VueBinging}`)
    push('\n')

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
   switch (node.type) {
    case NodeTypes.TEXT:
        genText(node, context)
        break;
    case NodeTypes.INTERPOLATION:
        genInterpolation(node, context)
        break
    case NodeTypes.SIMPLE_EXPRESSION:
        genExpression(node, context)
        break
    default:
        break;
   }
}

function genText(node, context) {
    const {push} = context
    push(`'${node.content}'`) 
}

function genInterpolation(node: any, context: any) {
    genCode(node.content, context)
}

function genExpression(node: any, context: any) {
    const {push} = context
    push(node.content) 
}


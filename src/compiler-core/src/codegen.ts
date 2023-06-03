import { NodeTypes } from "./ast"
import { TO_DISPLAY_STRING, runtimeHelpersMap } from "./runtimeHelpers"

export function generate(ast) {
    const node = ast.codegenNode
    const context = createCodegenContext()
    const {push} = context

    genFunctionPreamble(ast, context)

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
        },
        helper(key) {
            return runtimeHelpersMap[key]
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
    const {push, helper} = context
    push(`_${helper(TO_DISPLAY_STRING)}("`)
    genCode(node.content, context)
    push('")')
}

function genExpression(node: any, context: any) {
    const {push} = context
    push(node.content) 
}

function genFunctionPreamble(ast: any, context: any) {
    const {push, helper} = context
    const VueBinging = 'Vue'
    const aliasHelper = s => `${helper(s)}:_${helper(s)}`
    if(ast.helpers.length) {
        push(`const { ${ast.helpers.map(aliasHelper).join(',')} } = ${VueBinging}`)
    }
        
    push('\n')
}


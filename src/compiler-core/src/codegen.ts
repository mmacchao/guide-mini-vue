import { isString } from "../../share/index"
import { NodeTypes } from "./ast"
import { CREATE_VNODE, TO_DISPLAY_STRING, runtimeHelpersMap } from "./runtimeHelpers"

export function generate(ast, context?: any) {
    const node = ast.codegenNode
    context = context || createCodegenContext()
    const { push } = context

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
        case NodeTypes.ELEMENT:
            genElement(node, context)
            break
        case NodeTypes.COMPUND_EXPRESSION:
            genCompundExpression(node, context)
            break
        default:
            break;
    }
}
function genElement(node, context: any) {
    const { push, helper } = context
    const { tag, props, children } = node
    push(`_${helper(CREATE_VNODE)}(`)
    genNodeList(getNullable([tag, props, children]), context)
    // genCode(node.children, context)
    push(')')
}

function genNodeList(nodes, context) {
    const { push } = context
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (isString(node)) {
            push(`"${node}"`)
        } else if(node === null) {
            push(node + '')
        } else {
            genCode(node[0], context)
        }
        if (i < nodes.length - 1) {
            push(', ')
        }
    }
}

function genText(node, context) {
    const { push } = context
    push(`"${node.content}"`)
}

function genInterpolation(node: any, context: any) {
    const { push, helper } = context
    push(`_${helper(TO_DISPLAY_STRING)}(`)
    genCode(node.content, context)
    push(')')
}

function genExpression(node: any, context: any) {
    const { push } = context
    push(node.content)
}

function genFunctionPreamble(ast: any, context: any) {
    const { push, helper } = context
    const VueBinging = 'Vue'
    const aliasHelper = s => `${helper(s)}:_${helper(s)}`
    if (ast.helpers.length) {
        push(`const { ${ast.helpers.map(aliasHelper).join(',')} } = ${VueBinging}`)
    }

    push('\n')
}

function genCompundExpression(node: any, context: any) {
    const { push, helper } = context
    node.children.forEach(child => {
        if (typeof child === 'string') push(child)
        else
            genCode(child, context)
    })
}

function getNullable(args): any {
    return args.map(arg => arg || null)
}


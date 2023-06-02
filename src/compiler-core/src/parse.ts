import { NodeTypes } from "./ast"

export function baseParse(content) {
    const context = createParseContext(content)
    return createRoot(parseChildren(context))
}

function parseChildren(context) {
    const nodes: any = []
    const node = parseInterpolation(context)
    nodes.push(node)
    return nodes
}

function parseInterpolation(context) {
    const openDelimiter = '{{'
    const closeDelimiter = '}}'
    const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)
    const rawContentLength = closeIndex - openDelimiter.length
    context.source = context.source.slice(openDelimiter.length)
    const content = context.source.slice(0, rawContentLength)

    return {
        type: NodeTypes.INTERPOLATION,
        content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: content,
        }
    }
}

function createRoot(children) {
    return {
        children: children,
    }
}

function createParseContext(content) {
    return {
        source: content
    }
}
import { NodeTypes } from "./ast"

export function baseParse(content) {
    const context = createParseContext(content)
    return createRoot(parseChildren(context))
}

function parseChildren(context) {
    const nodes: any = []
    let node
    if (context.source.startsWith('{{')) {
        node = parseInterpolation(context)
        nodes.push(node)
    } else if (context.source.startsWith('<')) {
        if (/[a-z]/i.test(context.source[1])) {
            node = parseElement(context)
        }

    }
    nodes.push(node)

    return nodes
}
const enum TagTypes {
    START,
    END
}
function parseElement(context) {
   const node = parseTag(context, TagTypes.START)
   parseTag(context, TagTypes.END)
   return node
}
function parseTag(context, type) {
    const s = context.source
    const match: any = /^<\/?([a-z]*)/i.exec(s)
    const tag = match[1]
    context.source = context.source.slice(match[0].length+1)
    if(type === TagTypes.END) return
    return {
        type: NodeTypes.ELEMENT,
        tag
    }
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
            content: content.trim(),
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
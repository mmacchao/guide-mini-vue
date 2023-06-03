import { NodeTypes } from "./ast"

export function baseParse(content) {
    const context = createParseContext(content)
    return createRoot(parseChildren(context, []),)
}

function parseChildren(context, ancestors) {
    const nodes: any = []
    let node
    while (!isEnd(context, ancestors)) {

        if (context.source.startsWith('{{')) {
            node = parseInterpolation(context)
        } else if (context.source.startsWith('<')) {
            if (/[a-z]/i.test(context.source[1])) {
                node = parseElement(context, ancestors)
            }

        }

        if (!node) {
            node = parseText(context)
        }
        nodes.push(node)
    }




    return nodes
}
const enum TagTypes {
    START,
    END
}
function parseElement(context, ancestors) {
    const node: any = parseTag(context, TagTypes.START)
    ancestors.push(node.tag)
    const children = parseChildren(context, ancestors)
    if (children.length) {
        node.children = children
    }
    ancestors.pop(node.tag)
    if(startsWithEndTagOpen(context.source, node.tag)) {
        parseTag(context, TagTypes.END)
    } else {
        throw new Error(`缺失结束标签：${node.tag}`)
    }
    
    return node
}
function startsWithEndTagOpen(source, tag) {
    return source.startsWith('</') && source.slice(2, 2+tag.length).toLowerCase() === tag.toLowerCase()
}
function parseTag(context, type) {
    const s = context.source
    const match: any = /^<\/?([a-z]*)/i.exec(s)
    const tag = match[1]
    // context.source = context.source.slice(match[0].length+1)
    advancedBy(context, match[0].length + 1)
    if (type === TagTypes.END) return
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
    advancedBy(context, openDelimiter.length)
    const content = parseTextData(context, rawContentLength)
    advancedBy(context, closeDelimiter.length)

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

function parseText(context: any) {
    let endIndex = context.source.length
    const endTokens = ['</', '{{']
    endTokens.forEach(item => {
        const index = context.source.indexOf(item)
        if (index !== -1 && index < endIndex) {
            endIndex = index
        }
    })
    const content = parseTextData(context, endIndex)

    return {
        type: NodeTypes.TEXT,
        content,
    }
}

function parseTextData(context, length) {
    const content = context.source.slice(0, length)
    advancedBy(context, content.length)
    return content
}

function advancedBy(context: any, length: any) {
    context.source = context.source.slice(length)
}

function isEnd(context: any, ancestors: any) {
    const s = context.source
    for (let i = ancestors.length - 1; i >= 0; i--) {
        const tag = ancestors[i]
        if (tag && s.startsWith(`</${tag}>`)) {
            return true
        }
    }
    return !s.length
}


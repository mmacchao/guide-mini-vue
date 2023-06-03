export * from './reactivity/index'
export * from './runtime-dom/index'
import * as runtimeDom from './runtime-dom/index'
import { registerRuntimeCompiler } from './runtime-dom/index'

import { baseCompile } from './compiler-core/src/index'

function compileToFunction(template) {
    const {code} = baseCompile(template)
    const render = new Function('Vue', code)(runtimeDom)
    return render
}

registerRuntimeCompiler(compileToFunction)
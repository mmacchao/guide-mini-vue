import { camelize, toHandlerKey } from "../share/index"

export function emit(instance, event, ...args) {
    const {props} = instance

    // add-foo -> addFoo
   

    const handler = props[toHandlerKey(camelize(event))]
    if(handler) {
        handler(...args) 
    }
}
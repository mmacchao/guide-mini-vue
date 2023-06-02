export function shouldUpdateComponent(prevVnode, nextVnode) {
    const prevProps = prevVnode.props
    const nextProps = nextVnode.props
    for(const key in nextProps) {
        if(nextProps[key] !== prevProps[key]) {
            return true
        }
    }
    return false
}
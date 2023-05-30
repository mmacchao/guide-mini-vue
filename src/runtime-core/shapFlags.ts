export const enum ShapeFlags {
    ELEMENT = 1,
    STATEFUL_COMPONENT = 1 << 1,
    TEXT_CHILDREN = 1 << 2,
    ARRAY_CHILDREN = 1 << 3
}

// 4  3  2  1
// 0  0  0  0
// 第一位标识是否是Element
// 第二位标识是否是stateful_component
// 设计时不会让第一和第二位同时为0或同时为1   
      
// 要判断type和children, 如果是用普通变量，那vnode那需要维护shapFlag 和childrenShapFlag2个变量
// 而用位运算，可以只维护一个shapFlag，里面的某个位用来存储具体的值
// 可读性变差，位运算性能更好
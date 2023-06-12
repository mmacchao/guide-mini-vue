## mini-vue
本项目主要是学习时跟随视频进行的一些code，学习资源为：[小崔的Vue3源码实战课](https://learn.cuixueshe.com/p/t_pc/goods_pc_detail/goods_detail/p_61fb595ce4b0beaee4275e1e?product_id=p_61fb595ce4b0beaee4275e1e)
### 代码调试
```cookie
yarn install

yarn build --watch

然后用浏览器打开example目录里面的html文件即可
```
### 项目从零开始的一些配置项
```
yarn init -y // 初始化项目
yarn add typescript --dev
npx tsc --init
yarn add jest @types/jest --dev

tsconfig.json -> type: ["jest"]
package.json -> scripts -> test: "jest"

https://jestjs.io/docs/getting-started // 配置esm转commonjs
yarn add --dev babel-jest @babel/core @babel/preset-env
yarn add --dev @babel/preset-typescript
创建babel.config.json

// 安装rollup
yarn add rollup --dev
创建rollup.config.js

// 安装rollup插件
yarn add @rollup/plugin-typescript --dev
// 安装tslib

yarn test -u // 更新快照

QA：
    jest插件不生效 -> 删除重装



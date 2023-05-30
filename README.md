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

QA：
    jest插件不生效 -> 删除重装
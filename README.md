<!--
 * @Author: 唐王瑶
 * @Email：tangwangyao@hualala.com
 * @Date: 2022-06-10 21:05:32
 * @Description: 页面/组件/功能的描述
 * @FilePath: /YD-design/README.md
-->
<div align="center">
  <h1>YD Design</h1>
</div>

<div align="center">

A comprehensive React UI components library based on the [YD Design](https://YD.design/) system.

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/YD-design/YD-design/blob/main/LICENSE)
[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/YD-design/awesome-YD)

</div>

<div align="center">

English | [简体中文](./README.zh-CN.md)

</div>

# Features

## Comprehensive

With more than 60 crafted components that you can use out of the box.

## Customizable theme

Extensive design tokens can be customized to build your own theme. Two ways
of customization are supported:

* [With less-loader](https://YD.design/react/docs/theme)
* [Design Lab](https://YD.design/themes) - Recommended!

## Reusable custom materials

[Material market](https://YD.design/material/) provides a one-stop solution for materials management. Reuse customized modules to make a breakthrough in efficiency.

## TypeScript friendly

All components are written in TypeScript so it's type friendly.


# Installation

Available as an [npm package](https://www.npmjs.com/package/@YD-design/web-react)

```bash
// with npm
npm install @YD-design/web-react

// with yarn
yarn add @YD-design/web-react
```

# Examples

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@YD-design/web-react';
import '@YD-design/web-react/dist/css/YD.css';

function App() {
  return (
    <Button type='secondary'>
      Hello World
    </Button>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
```


# Browser Support

| [<img src="https://p1-YD.byteimg.com/tos-cn-i-uwbnlip3yd/08095282566ac4e0fd98f89aed934b65.png~tplv-uwbnlip3yd-png.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://p1-YD.byteimg.com/tos-cn-i-uwbnlip3yd/40ad73571879dd8d9fd3fd524e0e45a4.png~tplv-uwbnlip3yd-png.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://p1-YD.byteimg.com/tos-cn-i-uwbnlip3yd/4f59d35f6d6837b042c8badd95871b1d.png~tplv-uwbnlip3yd-png.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://p1-YD.byteimg.com/tos-cn-i-uwbnlip3yd/eee2667f837a9c2ed531805850bf43ec.png~tplv-uwbnlip3yd-png.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://p1-YD.byteimg.com/tos-cn-i-uwbnlip3yd/3240334d3967dd263c8f4cdd2d93c525.png~tplv-uwbnlip3yd-png.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://p1-YD.byteimg.com/tos-cn-i-uwbnlip3yd/f2454685df95a1a557a61861c5bec256.png~tplv-uwbnlip3yd-png.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Electron |
| --------- | --------- | --------- | --------- | --------- | --------- |
| Edge 16| 31| 49 | 31 | 36 | last 2 versions |

# Contributing

Developers interested in contributing should read the [Code of Conduct](./CODE_OF_CONDUCT.md) and the [Contributing Guide](./CONTRIBUTING.md).

Thank you to all the people who already contributed to YDDesign!

<a href="https://github.com/YD-design/YD-design/graphs/contributors"><img src="https://contrib.rocks/image?repo=YD-design/YD-design" /></a>

# License

This project is [MIT licensed](./LICENSE).

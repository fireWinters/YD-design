---
order: 0
title:
  zh-CN: 基础用法
  en-US: Basic
---

## zh-CN

最简单的用法。

## en-US

Basic usage example.

```js
import { TreeSelect } from '@arco-design/web-react';

const TreeNode = TreeSelect.Node;

ReactDOM.render(
  <TreeSelect defaultValue="node1" style={{ width: 300 }} allowClear>
    <TreeNode key="node1" title="Trunk">
      <TreeNode key="node2" title="Leaf" />
    </TreeNode>
    <TreeNode key="node3" title="Trunk2">
      <TreeNode key="node4" title="Leaf" />
      <TreeNode key="node5" title="Leaf" />
    </TreeNode>
  </TreeSelect>,
  CONTAINER
);
```

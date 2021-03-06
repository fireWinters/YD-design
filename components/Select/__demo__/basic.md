---
order: 0
title:
  zh-CN: 基础用法
  en-US: Basic
---

## zh-CN

基础选择器。

## en-US

Basic usage of Select.

```js
import { Select, Message, Space } from '@arco-design/web-react';

const Option = Select.Option;

const options = ['Beijing', 'Shanghai', 'Guangzhou', 'Disabled'];

ReactDOM.render(
  <Space size="large">
    <Select
      placeholder="Please select"
      style={{ width: 154 }}
      onChange={(value) => Message.info({ content: `You select ${value}.`, showIcon: true })}
    >
      {options.map((option, index) => (
        <Option key={option} disabled={index === 3} value={option}>
          {option}
        </Option>
      ))}
    </Select>
    <Select
      placeholder="Select city"
      style={{ width: 154 }}
      defaultValue="Beijing"
      disabled
    >
      {options.map((option, index) => (
        <Option key={option} disabled={index === 4} value={option}>
          {option}
        </Option>
      ))}
    </Select>
  </Space>,
  CONTAINER
);
```

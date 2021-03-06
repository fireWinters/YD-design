---
file: interface
---

`````
Component / Data Entry

# Select

When users need to select one or more from a group of similar data, they can use Select to click and select the corresponding item.
`````

%%Content%%

## API

%%Props%%

### VirtualListProps

|Property|Description|Type|Default|
|---|:---:|:---:|---:|
|height|Viewable area height (`2.11.0` starts to support `string` type such as `80%`)|`number`| 200 |
|threshold|The threshold of the number of elements that automatically enable virtual scrolling, pass in `null` to disable virtual scrolling.|`number` \| `null`| 100 |
|isStaticItemHeight|Whether it is a static element of the same height|`boolean`|true|

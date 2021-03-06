## 2.34.0

2022-05-27

### π Enhancement

- Reduce the number of computations for `Typography` on first render([#935](https://github.com/arco-design/arco-design/pull/935))

## 2.33.1

2022-05-20

### π BugFix

- Fixed the bug that the `Expand/Collapse` button of the `Typography` component was displayed at the wrong time([#890](https://github.com/arco-design/arco-design/pull/890))

## 2.33.0

2022-05-13

### π Feature

- The `Typography` component omits the scene to support expanding controlled.([#867](https://github.com/arco-design/arco-design/pull/867))

### π BugFix

- Fix the bug of folding error when `Typography` component uses inline elements such as `code`.([#866](https://github.com/arco-design/arco-design/pull/866))

## 2.32.2

2022-04-29

### π BugFix

- Fix the bug that the `Tooltip` is invalid when the `Typography` component is omitted from a single line([#822](https://github.com/arco-design/arco-design/pull/822))

## 2.32.0

2022-04-15

### π BugFix

- `Typography` component multi-line omit folding supports different styles of textγ([#776](https://github.com/arco-design/arco-design/pull/776))
- Fix the bug of folding error after `Typography` sets `white-space`([#772](https://github.com/arco-design/arco-design/pull/772))

## 2.31.0

2022-03-25

### π Feature

- `Typography`'s `copyable` and `editable` expose the `event` parameter corresponding to the click callback.([#684](https://github.com/arco-design/arco-design/pull/684))

## 2.29.2

2022-02-25

### π BugFix

- Fix the bug that the `onStart` input parameter was wrong when the `Typography` component was editing the state([#555](https://github.com/arco-design/arco-design/pull/555))

## 2.29.1

2022-02-18

### π Optimization

- Reduce the impact of the mirror `dom` on automated tests after `Typography` folding calculation([#554](https://github.com/arco-design/arco-design/pull/554))

## 2.28.1

2022-01-14

### π BugFix

- Fixed the bug that the `Typography` component was folded incorrectly in the browser zoom scene.([#441](https://github.com/arco-design/arco-design/pull/441))

## 2.27.0

2021-12-17

### π Feature

- The `event` parameter has been added to the `onExpand` callback parameter of the Typography` component.([#328](https://github.com/arco-design/arco-design/pull/328))

## 2.26.2

2021-12-10

### π BugFix

- Fix the bug that the calculation result of `Typography` is incorrectly when ellipsised in the international scene([#301](https://github.com/arco-design/arco-design/pull/301))
- Fix the bug that the copy result is wrong when `Typography` wraps multiple dynamic strings and `copyable`([#301](https://github.com/arco-design/arco-design/pull/301))

## 2.26.0

2021-12-03

### π BugFix

- Fix the bug that the `Typography` component does not take effect after setting `showTooltip`.([#266](https://github.com/arco-design/arco-design/pull/266))

## 2.25.0

2021-11-19

### π Feature

- The `Ellipsis` of `Typography` supports the `cssEllipsis` property. In simple scenarios, css is used by default.([#191](https://github.com/arco-design/arco-design/pull/191))

## 2.24.1

2021-11-12

### π BugFix

- `Typography` folding calculation optimization, fix display error in extreme cases of single-line folding.([#152](https://github.com/arco-design/arco-design/pull/152))

## 2.23.5

2021-10-29

### π BugFix

- Fix the bug of using unupdated variables for calculation when the `Typography` component is in the collapsed state.([#57](https://github.com/arco-design/arco-design/pull/57))

## 2.23.1

2021-10-15

### π BugFix

- Fix the bug that the `Typography` component will be parsed into an array when multiple dynamic strings are wrapped.
- Fix the bug that the `Typography` component will throw an error in the `editing` state after setting `ellipsis`.

## 2.23.0

2021-09-27

### π Optimization

- Optimize the calculation timing in the case of `Typography` ellipsised.

### π BugFix

- Fix the bug of `Typography` component truncating English characters, causing text overflow.

## 2.22.0

2021-09-10

### π BugFix

- Fix text display width calculation error of `Typography` in `flex` mode
-  Fix the bug that the `Typography` component `ellipsis` cannot be re-rendered when the `ellipsis` is under control
-  Fix the bug that the call of `Typography` component `ellipsis` cannot be triggered when passing `onExpand`
-  Fix the bug that the status of `ellipsis` cannot be automatically updated according to the taste when `resize` of the `Typography` window

## 2.20.1

2021-08-06

### π Bugfix

- Fix the bug that the `Typography` component does not support the native `dom` attribute.
- Fix the bug that the `Typography` component sometimes jitters when it is rendered for the first time.

### π TypeScript

- Modify the `ellipsis.showTooltip.props` of the `Typography` component to be optional.



## 2.19.1

2021-07-18

### π Bugfix

- Fix the bug that the copy function of `Typography` component does not work in Android webview.



## 2.19.0

2021-07-16

### π Bugfix

- Fix the bug that the copy function of `Typography` component does not work in Android webview.

## 2.14.1

2021-04-16

### π Bugfix

- Fix the bug that the copy function of `Typography` component does not work on the Android system browser.


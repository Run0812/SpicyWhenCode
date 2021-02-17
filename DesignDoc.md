# 设计文档

## API

- EnterAction
  - Describes what to do when pressing Enter.
- TextEditor
  - Represents an editor that is attached to a document.
- Workspace
  - onDidChangeTextDocument
  
## rxjs
- [RepeatWhen](https://rxjs-dev.firebaseapp.com/api/operators/repeatWhen) 可以用来使keyword重新开始
- [sequenceEqual](https://rxjs-dev.firebaseapp.com/api/operators/sequenceEqual) 关键词比较
- [bufferCount](https://rxjs-dev.firebaseapp.com/api/operators/bufferCount) keyword滑动窗口
- [timeInterval](https://rxjs-dev.firebaseapp.com/api/operators/timeInterval) 和上一次触发的时间间隔
- timeout 配合 retry


## 玩法
- w a s d 等关键词触发移动 Token将前后移动？
- 累积XX单词 会触发某些效果
- 连续字母 触发效果
  
## 框架结构
- 基于事件流的响应式编程
  - 通过onDidChangeTextDocument获得输入流
  - 触发按键流
    - 生成 N 击流  - 间隔 - 次数 - 生成流
    - 生成连续keywords流
    - 生成累积keywords流
  - 触发响应

## 问题
1. 事件系统如何实现
   1. 谁持有事件
   2. 如何约束事件的trigger和监听函数的handler具有相同的签名
2. 事件流要不直接RxJs

## 具体实现
1. 需要什么
   1. 触发条件
      1. 按顺序的字母集
      2. 关键字母之间的时间间隔
      3. 关键字母之间的字母间隔
         1. 比较麻烦
         2. 暂不实现
   2. 流的管理与映射
      1. 加载配置
      3. 流的生成
      4. hanlder监听的订阅关联  Condition => Handler
      5. Condition 作用在输入流上，得到自己关心的事件流
         1. 是一组操作
      6. Handler订阅该事件流即可
   3. 流转换的公共方法
  
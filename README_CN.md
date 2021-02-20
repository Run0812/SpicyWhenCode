# spicy-when-code

本插件目标是让你在写代码的时候着急上火。**特别适合整蛊朋友。**

## 程序结构

程序主要分为两个部分 1. 触发条件 2.执行操作。
本插件的亮点在于采用响应式编程的方式对事件进行了高阶处理，使得异步调用易于编写和扩展。

### 触发条件
触发条件核心是监听用户的输入事件，将文本改变事件重新映射成单字符的输入事件。
运用响应式编程的思想，将输入事件看作流，对流进行Buffer、map、merge等操作转换成下级的条件流，完成条件的监听。
目前插件接入Rxjs，主要实现两种操作符
- Keyword：连续输入字符是否匹配
- nClick：一段时间内是否输入某字符N次

### 执行操作
执行操作使用VS Code的API，主要提供了
- 文件操作 新建/删除
- 光标 移动/样式更改
- 文本修改 删除/插入/替换

## TODO
插件结构上支持定义映射，计划中用户可以自定义触发条件和执行的映射关系。
此外，本插件实际上是实现了将文本重映射成用户操作的功能，只要重新实现Handler部分可以接入任何其他插件功能
- 控制游戏操作
- 关键词触发宏指令
- 等等

## 特性

### Usage
`Ctrl+Shift+P` 打开命令面板
- Spicy: 开启老火模式
- Spicy: 退出老火模式
- Spicy: 关闭插件

### Click
- wasd
   -  w: 光标上移
   -  a: 光标上移
   -  s: 光标上移
   -  d: 光标上移
![](https://raw.githubusercontent.com/Run0812/SpicyWhenCode/main/images/wasd.gif)
- 双击wasd
   - double w: token上移
   - double a: token左移
   - double s: token下移
   - double d: token右移
![](https://raw.githubusercontent.com/Run0812/SpicyWhenCode/main/images/wasd-double.gif)
- 任何输入
   - 随机改变光标样式
![](https://raw.githubusercontent.com/Run0812/SpicyWhenCode/main/images/cursor_style.gif)

### Keyword
- return
  - 删除上一行
- del 
  - 删除本行
![](https://raw.githubusercontent.com/Run0812/SpicyWhenCode/main/images/del.gif)
-  gg: 删除本文件
![](https://raw.githubusercontent.com/Run0812/SpicyWhenCode/main/images/gg.gif)
- new: 新建随机名文件 and 展示 "Happy New Year" 在状态栏
![](https://raw.githubusercontent.com/Run0812/SpicyWhenCode/main/images/new.gif)
-  split: 替换为 " s p l i t e "
![](https://raw.githubusercontent.com/Run0812/SpicyWhenCode/main/images/split.gif)
-  if: 自动补全 - "if I were a boy~"
![](https://raw.githubusercontent.com/Run0812/SpicyWhenCode/main/images/if.gif)
-  for: 自动补全 - "for what? bro"
![](https://raw.githubusercontent.com/Run0812/SpicyWhenCode/main/images/for.gif)

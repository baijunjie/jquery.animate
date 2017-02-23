# Changelog

### v1.8.4

- 修复了 toggle() 显示时，设置了宽或高为百分比的隐藏元素，在显示动画中目标宽高不准确的问题。

### v1.8.3

- 如果一个含有动画队列的元素在动画过程中被 remove()，此时执行 finish() 会报错。现在会忽略掉这个操作，而不是报错，导致页面程序异常。

### v1.8.1

- 修复了 duration 、easing 参数为 null 时，可能引起的错误。

### v1.8.0

- jQuery原生的 animate() 现在可以通过 _animate() 来调用
- 修复了颜色动画不能正常工作的问题

### v1.7.3

- 修复了在使用 fadeIn/fadeOut/fadeToggle 时，动画元素会被添加 overflow: hidden 的问题

### v1.7.2
- 修复了使用如 slideDown() 后，临时样式清除不干净的问题

### v1.7.1
- 修复了使用 animate() 设置 {z:0} 时无效的问题

### v1.7.0
- 由于 jQuery 3.0.0 以及之后的版本已经兼容 requestAnimationFrame API，因此插件中将原有的 [jQuery requestAnimationFrame - v0.1.3pre](https://github.com/gnarf37/jquery-requestAnimationFrame) 移除。

### v1.6.13
- 修复了当动画属性值设置为“-=”某个值时，动画无效果的问题

### v1.6.12
- show/hide/toggle、fadeIn/fadeOut/fadeToggle、slideDown/slideUp/slideToggle 等动画结束后，overflow属性将恢复正常

### v1.6.11
- 修复了当元素为inline元素时，涉及到width与height的动画会不正常的问题

### v1.6.10
- toggle、fadeToggle、slideToggle 的效果更佳接近 jQuery 源生的效果

### v1.6.9
- 修复了 toggle、fadeToggle、slideToggle 等动画无效的问题

### v1.6.8
- 修复了 show/hide、fadeIn/fadeOut、slideDown/slideUp 等从无到有动画会结束后，会将原有的 overflow 的内联样式置空的问题

### v1.6.7
- 修复了 show/hide、fadeIn/fadeOut、slideDown/slideUp 等从无到有动画会将 inline-block 元素变成 block 元素的问题  

### v1.6.6
- 修复了在window平台下的safari浏览器下，删除img属性会导致程序报错的问题

### v1.6.5
- 修复了一个 bug，该 bug 导致 img 元素的 translate 属性在使用 jQuery 源生 .animate() 方法时会不正常

### v1.6.4
- 修复了一个 bug，该 bug 导致 ie 浏览器中会将数字判断为颜色值

### v1.6.3
- 修复了一个 bug，该 bug 导致 .slideUp() 动画运行一半时调用 .stop().slideDown() 动画就会停止


### v1.6.2
- 优化了动画属性起始值与结束值之间的单位转换

### v1.6.1
- 修复了一个 .stop() 停止位置错误的bug

### v1.6.0
- 集成了 [jQuery Easing v1.3](http://gsgd.co.uk/sandbox/jquery/easing/)
- 集成了 [jQuery requestAnimationFrame - v0.1.3pre](https://github.com/gnarf37/jquery-requestAnimationFrame)

### v1.5.2
- 修复了一个严重的 bug，该 bug 导致动画队列不正常。

### v1.5.1
- 现在可以支持 text-shadow 和 box-shadow 的阴影动画了

### v1.4.2
- 现在可以正确的识别递增和递减值了，例如：$("div").animate({ left: "+=100%" });

### v1.4.1
- 优化代码结构
- 当为 transform 中的属性分别设置了不同的 easing 时，现在改为使用原来的 <b>jQuery.animate</b> 方法来实现该动画

### v1.4
- 现在支持复合属性的动画了
- 区分开透视点的两种设置方法

### v1.3
- 修正了一个严重的 bug
- 弃用 transitionend 事件

### v1.2
- 添加了对颜色动画的支持
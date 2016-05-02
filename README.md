# jquery.animate

重写了 <b>jQuery.animate</b> 的默认行为，使它优先使用 <b>CSS3 Transition</b> 来实现动画。<br>

Rewrite the <b>jQuery.animate</b>'s default behavior, The priority use <b>CSS3 Transition</b> to achieve animation.<br>


## 为什么使用？ / Why use?

这个插件是对 <b>jQuery.animate</b> 方法的改写，你不需要考虑修改你的代码，你只需要导入插件，就可以让你所有的 <b>jQuery</b> 动画转化为 <b>CSS3 Transition</b>。<br>

This plugin is the rewriting of <b>jQuery.animate</b> method, you do not need to consider modifying your code, you just need to include plug-in, can let all of your <b>jQuery</b> animation into <b>CSS3 Transition</b>.<br>


## Usage

将 [jquery.animate.js] 引在 jQuery 之后。<br>
Just include [jquery.animate.js] after jQuery.<br>


``` html

<script src="jquery.js"></script>
<script src="jquery.animate.js"></script>

```
[jquery.animate.js]: https://github.com/baijunjie/jquery.animate/blob/master/jquery.animate.js


## cssHook

可以直接通过 <b>.css()</b> 方法来设置 <b>Transform</b> 属性。<br>
Can be directly through the <b>.css()</b> method to set the <b>Transform</b> properties.<br>

``` js
$("div").css({ x: "100px" });                       //=> translate(100px, 0)
$("div").css({ y: "100%" });                        //=> translate(0, 100%)
$("div").css({ translate: [200,100] });             //=> translate(200px, 100px)
$("div").css({ translate3d: [200,100,300] });       //=> translate(200px, 100px) translateZ(300px) 
$("div").css({ scale: 2 });                         //=> scale(2)
$("div").css({ scaleX: 3 });                        //=> scale(3,1)
$("div").css({ scaleZ: 2 });                        //=> scaleZ(2)
$("div").css({ scale3d: [2, 1.5, 4] });             //=> scale(2,1.5) scaleZ(4) 
$("div").css({ rotate: "30deg" });                  //=> rotate(30deg)
$("div").css({ rotateX: 45 });                      //=> rotateX(45deg)
$("div").css({ rotateY: "1rad" });                  //=> rotateX(1rad)
$("div").css({ rotateZ: 90 });                      //=> rotate(90deg)
$("div").css({ rotate3d: [60,30,90] });             //=> rotateX(60deg) rotateY(30deg) rotate(90deg)
$("div").css({ skewX: "30deg" });                   //=> skewX(30deg)
$("div").css({ skewY: 60 });                        //=> skewY(60deg)
$("div").css({ skew: [30,60] });                    //=> skewX(30deg) skewY(60deg)
```


设置透视点。<br>
Set perspective.<br>

```js
// Note the difference between
$("div").css({ "perspective": 100 });  //=>  perspective: 100px;
$("div").css({ "pers": 100 });         //=>  transform: perspective(100px);
```


读取属性值。<br>
Read the attribute value.<br>
``` js
$("div").css({ x: 100 }).css("x");                       //=> "100px"
$("div").css({ x: 100, y: 200 }).css("translate");       //=> ["100px", "200px"]
$("div").css({ scaleX: 3, scaleY: 3 }).css("scale");     //=> "3"
$("div").css({ scaleX: 3 }).css("scale");                //=> ["3","1"]

```


支持删除属性。<br>
Support delete attributes.<br>
```js
.css({ translate: "2, 5" });                 //=> "translate(2px, 5px)"
.css({ translate: "" });                     //=> remove "translate(2px, 5px)"
.css({ scale: "2,3" }).css({ scaleX: "" });  //=> "scale(1, 3)"
```


## animate

支持 <b>jQuery.animate</b> 原生的所有写法。<br>
Support all <b>jQuery.animate</b> native writing.<br>

```js
$("div").hide(2000);
$("div").hide().slideDown(2000, "easeOutBack");
$("div").hide().fadeIn(2000, function() { ... });

$("div").animate({left: 100});
$("div").animate({x: 200}, 1000, "easeOutBack", function() { ... });

$("div").animate({opacity: 0},{
	queue: false,
	duration: 2000,
	easing: "linear"
});

$("div").animate({
	left: [100, "linear"],
	top: [200, "easeOutBack"],
	scale: [[2,3], "easeInBack"]
});

$("div").animate({
	left: 100,
	top: 200
},{
	queue: false,
	duration: 2000,
	specialEasing: {
		left: "linear",
		top: "easeOutBack"
	}
});
```

<b>Transform</b> 属性还支持特殊的写法。<br>
<b>Transform</b> properties also supports special writing.<br>

```js
$("div").animate({ "scale": [1, 2] });
$("div").animate({ "rotate3d": "30,20,90" });
```


支持复合属性的动画。<br>
To support the animation of the composite properties.<br>

```js
$("div").animate({ "border-radius": "10px 20px 30px 40px" });
$("div").animate({ "transform-origin": "100px 300px" });
$("div").animate({ "box-shadow": "inset 50px 50px 1px #000"});
```


可以完美支持 <b>.stop()</b> 以及 <b>.finish()</b> 方法。<br>
Can perfect support <b>.stop()</b> and <b>.finish()</b> method.<br>
```js
$("div").animate({ x: 200 }, 2000, "linear");
window.setTimeout(function() {
	$("div").stop();
	console.log($("div").css("x"));  //=> 100px
}, 1000);
```
```js
$("div").animate({ x: 200 }, 2000, "linear");
$("div").finish();
console.log($("div").css("x"));  //=> 200px
```

现在可以支持颜色动画了，并且可以使用 <b>.stop()</b> 方法停止到某个颜色值。<br>
Can support color animation now, and you can use the <b>.stop()</b> method to stop to a color value.<br>

```js
$("div").animate({ "background-color": "black" }, 5000);
```


注意，由于 <b>CSS3 Transition</b> 动画的只支持三次贝塞尔曲线，因此[jQuery.easing]中的某些缓动无法支持，比如：Bounce。<br>
如果使用了它不支持的 <b>Easing</b>，那么将会使用原来的 <b>jQuery.animate</b> 方法来实现该动画。<br>

Note that because of <b>CSS3 Transition</b> animation support only three times bezier curve, so some slow moving in [jQuery.easing] cannot support, such as: Bounce.<br>
If use it does not support <b>Easing</b>, We will use the original <b>jQuery.animate</b> methods to achieve this animation.<br>

同时，所有的 <b>Transform</b> 属性不能分别设置 <b>Easing</b>，因为他们的 <b>Transition</b> 都是通过 <b>Transform</b> 属性来设置的。<br>
<del>因此，如果发生这种情况，那么只有第一个 <b>Easing</b> 将作为 <b>transition-timing-function</b>。</del><br>
因为原则上应该优先兼容动画效果，因此这种情况下，将会使用原来的 <b>jQuery.animate</b> 方法来实现该动画。<br>

Meanwhile, all the <b>Transform</b> property can not be separately set <b>Easing</b>, because their <b>Transition</b> through <b>Transform</b> property to set the.<br>
<del>So, if this happens, only the first <b>Easing</b> will serve as <b>transition-timing-function</b>.</del><br>
Because in principle should be the priority compatible animation effects, so in this case, will use the original <b>jQuery.animate</b> ways to implement this animation.<br>

```js
$("div").animate({
	x: [300, "easeOutBack"],
	y: [200, "linear"],
	scale: [3, "easeInBack"]
});

// CSS will be like this
div {
	transform: translate(300px, 200px) scale(3);
	transition: transform 2000ms easeOutBack;
}

```

[jQuery.easing]: https://github.com/gdsmith/jquery.easing

以下是插件支持的缓动列表。<br>
The following is a list of transit support slow.<br>

```js
$.cssEase = {
    "_default":       "swing",
    "swing":          "easeOutQuad", // 和 jQuery Easing 相同，查看详情 https://github.com/gdsmith/jquery.easing
    "linear":         "cubic-bezier(0,0,1,1)",
    "ease":           "cubic-bezier(.25,.1,.25,1)",
    "easeIn":         "cubic-bezier(.42,0,1,1)",
    "easeOut":        "cubic-bezier(0,0,.58,1)",
    "easeInOut":      "cubic-bezier(.42,0,.58,1)",

    "easeInCubic":    "cubic-bezier(.550,.055,.675,.190)",
    "easeOutCubic":   "cubic-bezier(.215,.61,.355,1)",
    "easeInOutCubic": "cubic-bezier(.645,.045,.355,1)",
    "easeInCirc":     "cubic-bezier(.6,.04,.98,.335)",
    "easeOutCirc":    "cubic-bezier(.075,.82,.165,1)",
    "easeInOutCirc":  "cubic-bezier(.785,.135,.15,.86)",
    "easeInExpo":     "cubic-bezier(.95,.05,.795,.035)",
    "easeOutExpo":    "cubic-bezier(.19,1,.22,1)",
    "easeInOutExpo":  "cubic-bezier(1,0,0,1)",
    "easeInQuad":     "cubic-bezier(.55,.085,.68,.53)",
    "easeOutQuad":    "cubic-bezier(.25,.46,.45,.94)",
    "easeInOutQuad":  "cubic-bezier(.455,.03,.515,.955)",
    "easeInQuart":    "cubic-bezier(.895,.03,.685,.22)",
    "easeOutQuart":   "cubic-bezier(.165,.84,.44,1)",
    "easeInOutQuart": "cubic-bezier(.77,0,.175,1)",
    "easeInQuint":    "cubic-bezier(.755,.05,.855,.06)",
    "easeOutQuint":   "cubic-bezier(.23,1,.32,1)",
    "easeInOutQuint": "cubic-bezier(.86,0,.07,1)",
    "easeInSine":     "cubic-bezier(.47,0,.745,.715)",
    "easeOutSine":    "cubic-bezier(.39,.575,.565,1)",
    "easeInOutSine":  "cubic-bezier(.445,.05,.55,.95)",
    "easeInBack":     "cubic-bezier(.6,-.28,.735,.045)",
    "easeOutBack":    "cubic-bezier(.175, .885,.32,1.275)",
    "easeInOutBack":  "cubic-bezier(.68,-.55,.265,1.55)"
};
```


# Changelog

## v1.6.9
* 修复了 toggle、fadeToggle、slideToggle 等动画无效的问题

## v1.6.8
* 修复了 show/hide、fadeIn/fadeOut、slideDown/slideUp 等从无到有动画会结束后，会将原有的 overflow 的内联样式置空的问题

## v1.6.7
* 修复了 show/hide、fadeIn/fadeOut、slideDown/slideUp 等从无到有动画会将 inline-block 元素变成 block 元素的问题  

## v1.6.6
* 修复了在window平台下的safari浏览器下，删除img属性会导致程序报错的问题

## v1.6.5
* 修复了一个 bug，该 bug 导致 img 元素的 translate 属性在使用 jQuery 源生 .animate() 方法时会不正常

## v1.6.4
* 修复了一个 bug，该 bug 导致 ie 浏览器中会将数字判断为颜色值

## v1.6.3
* 修复了一个 bug，该 bug 导致 .slideUp() 动画运行一半时调用 .stop().slideDown() 动画就会停止


## v1.6.2
* 优化了动画属性起始值与结束值之间的单位转换

## v1.6.1
* 修复了一个 .stop() 停止位置错误的bug

## v1.6.0
* 集成了 [jQuery Easing v1.3](http://gsgd.co.uk/sandbox/jquery/easing/)
* 集成了 [jQuery requestAnimationFrame - v0.1.3pre](https://github.com/gnarf37/jquery-requestAnimationFrame)

## v1.5.2
* 修复了一个严重的 bug，该 bug 导致动画队列不正常。

## v1.5.1
* 现在可以支持 text-shadow 和 box-shadow 的阴影动画了

## v1.4.2
* 现在可以正确的识别递增和递减值了，例如：$("div").animate({ left: "+=100%" });

## v1.4.1
* 优化代码结构
* 当为 transform 中的属性分别设置了不同的 easing 时，现在改为使用原来的 <b>jQuery.animate</b> 方法来实现该动画

## v1.4
* 现在支持复合属性的动画了
* 区分开透视点的两种设置方法

## v1.3
* 修正了一个严重的 bug
* 弃用 transitionend 事件

## v1.2
* 添加了对颜色动画的支持


# Thanks

这个插件是参考以下插件编写的，感谢作者！<br> 
This plug-in is written in reference to the following plug-ins, thanks to the author!<br>

__[jquery.transit](https://github.com/rstacruz/jquery.transit)__<br>
__[jQuery 2D transformations](https://github.com/heygrady/transform/)__<br>
__[jquery.animate-colors](https://github.com/MilesOkeefe/jquery.animate-colors)__<br>
__[jQuery Easing v1.3](http://gsgd.co.uk/sandbox/jquery/easing/)__<br>
__[jQuery requestAnimationFrame - v0.1.3pre](https://github.com/gnarf37/jquery-requestAnimationFrame)__<br>






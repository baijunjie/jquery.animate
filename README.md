# jQuery.animate

重写了**jQuery.animate**的默认行为，使它优先使用 **CSS3 Transition**来实现动画。

Rewrite the **jQuery.animate**'s default behavior, The priority use **CSS3 Transition** to achieve animation.

[Changelog](https://github.com/baijunjie/jquery.animate/blob/master/Changelog.md)


## 为什么使用？ / Why use?

这个插件是对**jQuery.animate**方法的改写，你不需要考虑修改你的代码，你只需要导入插件，就可以让你所有的**jQuery**动画转化为**CSS3 Transition**。  
This plugin is the rewriting of **jQuery.animate** method, you do not need to consider modifying your code, you just need to include plug-in, can let all of your **jQuery** animation into **CSS3 Transition**.


## Usage

将 [jquery.animate.js] 引在 jQuery 之后。  
Just include [jquery.animate.js] after jQuery.


``` html
<script src="jquery.js"></script>
<script src="jquery.animate.js"></script>
```

#### AMD

```js
require.config({
	paths: {
		'jquery': 'jquery.min',
		'jquery.animate': 'jquery.animate.min',
	}
});

require(['jquery.animate'], function($) {
	// ...
});
```

## cssHook

可以直接通过 **.css()** 方法来设置 **Transform** 属性。  
Can be directly through the **.css()** method to set the **Transform** properties.

``` js
$('div').css({ x: '100px' });                       //=> translate(100px, 0)
$('div').css({ y: '100%' });                        //=> translate(0, 100%)
$('div').css({ translate: [200,100] });             //=> translate(200px, 100px)
$('div').css({ translate3d: [200,100,300] });       //=> translate(200px, 100px) translateZ(300px) 
$('div').css({ scale: 2 });                         //=> scale(2)
$('div').css({ scaleX: 3 });                        //=> scale(3,1)
$('div').css({ scaleZ: 2 });                        //=> scaleZ(2)
$('div').css({ scale3d: [2, 1.5, 4] });             //=> scale(2,1.5) scaleZ(4) 
$('div').css({ rotate: '30deg' });                  //=> rotate(30deg)
$('div').css({ rotateX: 45 });                      //=> rotateX(45deg)
$('div').css({ rotateY: '1rad' });                  //=> rotateX(1rad)
$('div').css({ rotateZ: 90 });                      //=> rotate(90deg)
$('div').css({ rotate3d: [60,30,90] });             //=> rotateX(60deg) rotateY(30deg) rotate(90deg)
$('div').css({ skewX: '30deg' });                   //=> skewX(30deg)
$('div').css({ skewY: 60 });                        //=> skewY(60deg)
$('div').css({ skew: [30,60] });                    //=> skewX(30deg) skewY(60deg)
```

设置透视点。  
Set perspective.

```js
// Note the difference between
$('div').css({ 'perspective': 100 });  //=>  perspective: 100px;
$('div').css({ 'pers': 100 });         //=>  transform: perspective(100px);
```

读取属性值。  
Read the attribute value.

``` js
$('div').css({ x: 100 }).css('x');                       //=> '100px'
$('div').css({ x: 100, y: 200 }).css('translate');       //=> ['100px', '200px']
$('div').css({ scaleX: 3, scaleY: 3 }).css('scale');     //=> '3'
$('div').css({ scaleX: 3 }).css('scale');                //=> ['3','1']
```

支持删除属性。  
Support delete attributes.

```js
.css({ translate: '2, 5' });                 //=> 'translate(2px, 5px)'
.css({ translate: '' });                     //=> remove 'translate(2px, 5px)'
.css({ scale: '2,3' }).css({ scaleX: '' });  //=> 'scale(1, 3)'
```


## animate

支持 **jQuery.animate** 原生的所有写法。  
Support all **jQuery.animate** native writing.

```js
$('div').hide(2000);
$('div').hide().slideDown(2000, 'easeOutBack');
$('div').hide().fadeIn(2000, function() { ... });

$('div').animate({left: 100});
$('div').animate({x: 200}, 1000, 'easeOutBack', function() { ... });

$('div').animate({opacity: 0},{
	queue: false,
	duration: 2000,
	easing: 'linear'
});

$('div').animate({
	left: [100, 'linear'],
	top: [200, 'easeOutBack'],
	scale: [[2,3], 'easeInBack']
});

$('div').animate({
	left: 100,
	top: 200
},{
	queue: false,
	duration: 2000,
	specialEasing: {
		left: 'linear',
		top: 'easeOutBack'
	}
});
```

**Transform** 属性还支持特殊的写法。  
**Transform** properties also supports special writing.

```js
$('div').animate({ 'scale': [1, 2] });        //=> scale(1,2)
$('div').animate({ 'rotate3d': '30,20,90' }); //=> rotateX(60deg) rotateY(30deg)
```

支持复合属性的动画。  
To support the animation of the composite properties.

```js
$('div').animate({ 'border-radius': '10px 20px 30px 40px' });
$('div').animate({ 'transform-origin': '100px 300px' });
$('div').animate({ 'box-shadow': 'inset 50px 50px 1px #000'});
```

可以完美支持 **.stop()** 以及 **.finish()** 方法。  
Can perfect support **.stop()** and **.finish()** method.

```js
$('div').animate({ x: 200 }, 2000, 'easeInOutBack');
window.setTimeout(function() {
	$('div').stop();
	console.log($('div').css('x'));  //=> ≈ 122.82226813307604px
}, 1000);
```
```js
$('div').animate({ x: 200 }, 2000, 'easeInOutBack');
$('div').finish();
console.log($('div').css('x'));  //=> 200px
```

现在可以支持颜色动画了，并且可以使用 **.stop()** 方法停止到某个颜色值。  
Can support color animation now, and you can use the **.stop()** method to stop to a color value.

```js
$('div')
	.css('background-color', 'white')
	.animate({ 'background-color': 'black' }, 3000);
window.setTimeout(function() {
    $('div').stop();
    console.log($('div').css('background-color'));  //=> ≈ rgb(107, 107, 107)
}, 1000);
```

注意，由于 **CSS3 Transition** 动画的只支持三次贝塞尔曲线，因此[jQuery.easing]中的某些缓动无法支持，比如：Bounce。  
如果使用了它不支持的 **Easing**，那么将会使用原来的 **jQuery.animate** 方法来实现该动画。

Note that because of **CSS3 Transition** animation support only three times bezier curve, so some slow moving in [jQuery.easing] cannot support, such as: Bounce.  
If use it does not support **Easing**, We will use the original **jQuery.animate** methods to achieve this animation.

同时，所有的 **Transform** 属性不能分别设置 **Easing**，因为他们的 **Transition** 都是通过 **Transform** 属性来设置的。  
~~因此，如果发生这种情况，那么只有第一个 **Easing** 将作为 **transition-timing-function**。~~  
因为原则上应该优先兼容动画效果，因此这种情况下，将会使用原来的 **jQuery.animate** 方法来实现该动画。

Meanwhile, all the **Transform** property can not be separately set **Easing**, because their **Transition** through **Transform** property to set the.  
~~So, if this happens, only the first **Easing** will serve as **transition-timing-function**.~~  
Because in principle should be the priority compatible animation effects, so in this case, will use the original **jQuery.animate** ways to implement this animation.

```js
$('div').animate({
	x: [300, 'easeOutBack'],
	y: [200, 'linear'],
	scale: [3, 'easeInBack']
});

// CSS will be like this
div {
	transform: translate(300px, 200px) scale(3);
	transition: transform 2000ms easeOutBack;
}
```

以下是插件支持的缓动列表。  
The following is a list of transit support slow.

```js
$.cssEase = {
    '_default':       'swing',
    'swing':          'easeOutQuad', // 和 jQuery Easing 相同，查看详情 https://github.com/gdsmith/jquery.easing
    'linear':         'cubic-bezier(0,0,1,1)',
    'ease':           'cubic-bezier(.25,.1,.25,1)',
    'easeIn':         'cubic-bezier(.42,0,1,1)',
    'easeOut':        'cubic-bezier(0,0,.58,1)',
    'easeInOut':      'cubic-bezier(.42,0,.58,1)',

    'easeInCubic':    'cubic-bezier(.550,.055,.675,.190)',
    'easeOutCubic':   'cubic-bezier(.215,.61,.355,1)',
    'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
    'easeInCirc':     'cubic-bezier(.6,.04,.98,.335)',
    'easeOutCirc':    'cubic-bezier(.075,.82,.165,1)',
    'easeInOutCirc':  'cubic-bezier(.785,.135,.15,.86)',
    'easeInExpo':     'cubic-bezier(.95,.05,.795,.035)',
    'easeOutExpo':    'cubic-bezier(.19,1,.22,1)',
    'easeInOutExpo':  'cubic-bezier(1,0,0,1)',
    'easeInQuad':     'cubic-bezier(.55,.085,.68,.53)',
    'easeOutQuad':    'cubic-bezier(.25,.46,.45,.94)',
    'easeInOutQuad':  'cubic-bezier(.455,.03,.515,.955)',
    'easeInQuart':    'cubic-bezier(.895,.03,.685,.22)',
    'easeOutQuart':   'cubic-bezier(.165,.84,.44,1)',
    'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
    'easeInQuint':    'cubic-bezier(.755,.05,.855,.06)',
    'easeOutQuint':   'cubic-bezier(.23,1,.32,1)',
    'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
    'easeInSine':     'cubic-bezier(.47,0,.745,.715)',
    'easeOutSine':    'cubic-bezier(.39,.575,.565,1)',
    'easeInOutSine':  'cubic-bezier(.445,.05,.55,.95)',
    'easeInBack':     'cubic-bezier(.6,-.28,.735,.045)',
    'easeOutBack':    'cubic-bezier(.175, .885,.32,1.275)',
    'easeInOutBack':  'cubic-bezier(.68,-.55,.265,1.55)'
};
```


# Thanks

这个插件是参考以下插件编写的，感谢作者！  
This plug-in is written in reference to the following plug-ins, thanks to the author!

[**jquery.transit**](https://github.com/rstacruz/jquery.transit)  
[**jQuery 2D transformations**](https://github.com/heygrady/transform/)  
[**jquery.animate-colors**](https://github.com/MilesOkeefe/jquery.animate-colors)  
[**jQuery Easing v1.3**](http://gsgd.co.uk/sandbox/jquery/easing/)  
[**jQuery requestAnimationFrame - v0.1.3pre**](https://github.com/gnarf37/jquery-requestAnimationFrame)



# 您的捐助是我最大的动力
![image](https://github.com/baijunjie/jquery.animate/blob/master/donations.jpg)


[jquery.animate.js]: https://github.com/baijunjie/jquery.animate/blob/master/jquery.animate.js
[jQuery.easing]: https://github.com/gdsmith/jquery.easing
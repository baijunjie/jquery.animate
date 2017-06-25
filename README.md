# jQuery.animate

Rewrite the **jQuery.animate**'s default behavior, The priority use **CSS3 Transition** to achieve animation.


## Why use?

This plugin is the rewriting of **jQuery.animate** method, you do not need to consider modifying your code, you just need to include plug-in, can let all of your **jQuery** animation into **CSS3 Transition**.


## Usage

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

#### NPM

安装

```
$ npm install jquery.animate
```

引入

```js
// ES6
import $ from 'jquery.animate'
// CommonJS
var $ = require('jquery.animate')
```

## cssHook

Can be directly through the **.css()** method to set the **Transform** properties.

``` js
$(elem).css({ x: '100px' });                       //=> translate(100px, 0)
$(elem).css({ y: '100%' });                        //=> translate(0, 100%)
$(elem).css({ translate: [200,100] });             //=> translate(200px, 100px)
$(elem).css({ translate3d: [200,100,300] });       //=> translate(200px, 100px) translateZ(300px) 
$(elem).css({ scale: 2 });                         //=> scale(2)
$(elem).css({ scaleX: 3 });                        //=> scale(3,1)
$(elem).css({ scaleZ: 2 });                        //=> scaleZ(2)
$(elem).css({ scale3d: [2, 1.5, 4] });             //=> scale(2,1.5) scaleZ(4) 
$(elem).css({ rotate: '30deg' });                  //=> rotate(30deg)
$(elem).css({ rotateX: 45 });                      //=> rotateX(45deg)
$(elem).css({ rotateY: '1rad' });                  //=> rotateX(1rad)
$(elem).css({ rotateZ: 90 });                      //=> rotate(90deg)
$(elem).css({ rotate3d: [60,30,90] });             //=> rotateX(60deg) rotateY(30deg) rotate(90deg)
$(elem).css({ skewX: '30deg' });                   //=> skewX(30deg)
$(elem).css({ skewY: 60 });                        //=> skewY(60deg)
$(elem).css({ skew: [30,60] });                    //=> skewX(30deg) skewY(60deg)
```

Set perspective.

```js
// Note the difference between
$(elem).css({ 'perspective': 100 });  //=>  perspective: 100px;
$(elem).css({ 'pers': 100 });         //=>  transform: perspective(100px);
```

Read the attribute value.

``` js
$(elem).css({ x: 100 }).css('x');                       //=> '100px'
$(elem).css({ x: 100, y: 200 }).css('translate');       //=> ['100px', '200px']
$(elem).css({ scaleX: 3, scaleY: 3 }).css('scale');     //=> '3'
$(elem).css({ scaleX: 3 }).css('scale');                //=> ['3','1']
```

Support delete attributes.

```js
$(elem).css({ translate: '2, 5' });                 //=> 'translate(2px, 5px)'
$(elem).css({ translate: '' });                     //=> remove 'translate(2px, 5px)'
$(elem).css({ scale: '2,3' }).css({ scaleX: '' });  //=> 'scale(1, 3)'
```


## animate

Support all **jQuery.animate** native writing.

```js
$(elem).hide(2000);
$(elem).hide().slideDown(2000, 'easeOutBack');
$(elem).hide().fadeIn(2000, function() { ... });

$(elem).animate({left: 100});
$(elem).animate({x: 200}, 1000, 'easeOutBack', function() { ... });

$(elem).animate({opacity: 0},{
    queue: false,
    duration: 2000,
    easing: 'linear'
});

$(elem).animate({
    left: [100, 'linear'],
    top: [200, 'easeOutBack'],
    scale: [[2,3], 'easeInBack']
});

$(elem).animate({
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

**Transform** properties also supports special writing.

```js
$(elem).animate({ 'scale': [1, 2] });        //=> scale(1,2)
$(elem).animate({ 'rotate3d': '30,20,90' }); //=> rotateX(30deg) rotateY(20deg) rotate(90deg)
```

To support the animation of the composite properties.

```js
$(elem).animate({ 'border-radius': '10px 20px 30px 40px' });
$(elem).animate({ 'transform-origin': '100px 300px' });
$(elem).animate({ 'box-shadow': 'inset 50px 50px 1px #000'});
```

Can perfect support **.stop()** and **.finish()** method.

```js
$(elem).animate({ x: 200 }, 2000, 'easeInOutBack');
window.setTimeout(function() {
    $(elem).stop();
    console.log($(elem).css('x'));  //=> ≈ 122.82226813307604px
}, 1000);
```
```js
$(elem).animate({ x: 200 }, 2000, 'easeInOutBack');
$(elem).finish();
console.log($(elem).css('x'));  //=> 200px
```

Can support color animation now, and you can use the **.stop()** method to stop to a color value.

```js
$('div')
    .css('background-color', 'white')
    .animate({ 'background-color': 'black' }, 3000);
window.setTimeout(function() {
    $(elem).stop();
    console.log($(elem).css('background-color'));  //=> ≈ rgb(107, 107, 107)
}, 1000);
```

**Note** that because of **CSS3 Transition** animation support only three times bezier curve, so some slow moving in [jQuery.easing] cannot support, such as: Bounce.  
If use it does not support **Easing**, We will use the original **jQuery.animate** methods to achieve this animation.

Meanwhile, all the **Transform** property can not be separately set **Easing**, because their **Transition** through **Transform** property to set the.  
~~So, if this happens, only the first **Easing** will serve as **transition-timing-function**.~~  
Because in principle should be the priority compatible animation effects, so in this case, will use the original **jQuery.animate** ways to implement this animation.

```js
$(elem).animate({
    x: [300, 'easeOutBack'],
    y: [200, 'linear'],
    scale: [3, 'easeInBack']
});
```

CSS will be like this

```css
element.style {
    transform: translate(300px, 200px) scale(3);
    transition: transform 2000ms easeOutBack;
}
```

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

This plug-in is written in reference to the following plug-ins, thanks to the author!

[**jquery.transit**](https://github.com/rstacruz/jquery.transit)  
[**jQuery 2D transformations**](https://github.com/heygrady/transform/)  
[**jquery.animate-colors**](https://github.com/MilesOkeefe/jquery.animate-colors)  
[**jQuery Easing v1.3**](http://gsgd.co.uk/sandbox/jquery/easing/)  
[**jQuery requestAnimationFrame - v0.1.3pre**](https://github.com/gnarf37/jquery-requestAnimationFrame)




[jquery.animate.js]: https://github.com/baijunjie/jquery.animate/blob/master/jquery.animate.js
[jQuery.easing]: https://github.com/gdsmith/jquery.easing
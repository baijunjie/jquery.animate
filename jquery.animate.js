/*!
 * jQuery Animate v1.0 - By CSS3 transition
 * @author baijunjie
 *
 * https://github.com/baijunjie/jquery.animate
 */

'use strict'
;(function(root, factory) {

	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		factory(root.jQuery);
	}

}(this, function($) {

	// 返回支持的属性名
	function getSupportPropertyName(prop) {
		var testElem = document.documentElement;
		if (prop in testElem.style) return prop;

		var testProp = prop.charAt(0).toUpperCase() + prop.substr(1),
			prefixs = [ 'Webkit', 'Moz', 'ms', 'O' ];

		for (var i = 0, l = prefixs.length; i < l; i++) {
			var prefixProp = prefixs[i] + testProp;
			if (prefixProp in testElem.style) {
				return prefixProp;
			}
		}
	}

	// 检查是否支持3D
	function checkTransform3dSupport() {
		var testElem = document.createElement('div');
		testElem.style[support.transform] = '';
		testElem.style[support.transform] = 'rotateY(90deg)';
		return testElem.style[support.transform] !== '';
	}

	var eventNames = {
		'transition'       : 'transitionend',
		'MozTransition'    : 'transitionend',
		'WebkitTransition' : 'webkitTransitionEnd',
		'OTransition'      : 'oTransitionEnd',
		'msTransition'     : 'MSTransitionEnd'
	};

	// 检查浏览器的 transition 支持
	var support = {};
	support.transform          = getSupportPropertyName('transform');
	if (!support.transform) return;
	support.transformOrigin    = getSupportPropertyName('transformOrigin');
	support.transformStyle     = getSupportPropertyName('transformStyle');
	support.perspective        = getSupportPropertyName('perspective');
	support.perspectiveOrigin  = getSupportPropertyName('perspectiveOrigin');
	support.backfaceVisibility = getSupportPropertyName('backfaceVisibility');
	support.filter             = getSupportPropertyName('filter');
	support.transition         = getSupportPropertyName('transition');
	support.transform3d        = checkTransform3dSupport();
	support.transitionEnd      = eventNames[support.transition];

	// 将检测到的支持结果写入 $.support
	for (var key in support) {
		if (support.hasOwnProperty(key) && typeof $.support[key] === 'undefined') {
			$.support[key] = support[key];
		}
	}

	// 缓动列表
	$.cssEase = {
		'_default'       : 'swing',
		'swing'          : 'easeOutQuad', // 和 jQuery Easing 相同，查看详情https://github.com/gdsmith/jquery.easing
		'linear'         : 'cubic-bezier(0,0,1,1)',
		'ease'           : 'cubic-bezier(.25,.1,.25,1)',
		'ease-in'        : 'cubic-bezier(.42,0,1,1)',
		'ease-out'       : 'cubic-bezier(0,0,.58,1)',
		'ease-in-out'    : 'cubic-bezier(.42,0,.58,1)',

		'easeInCubic'    : 'cubic-bezier(.550,.055,.675,.190)',
		'easeOutCubic'   : 'cubic-bezier(.215,.61,.355,1)',
		'easeInOutCubic' : 'cubic-bezier(.645,.045,.355,1)',
		'easeInCirc'     : 'cubic-bezier(.6,.04,.98,.335)',
		'easeOutCirc'    : 'cubic-bezier(.075,.82,.165,1)',
		'easeInOutCirc'  : 'cubic-bezier(.785,.135,.15,.86)',
		'easeInExpo'     : 'cubic-bezier(.95,.05,.795,.035)',
		'easeOutExpo'    : 'cubic-bezier(.19,1,.22,1)',
		'easeInOutExpo'  : 'cubic-bezier(1,0,0,1)',
		'easeInQuad'     : 'cubic-bezier(.55,.085,.68,.53)',
		'easeOutQuad'    : 'cubic-bezier(.25,.46,.45,.94)',
		'easeInOutQuad'  : 'cubic-bezier(.455,.03,.515,.955)',
		'easeInQuart'    : 'cubic-bezier(.895,.03,.685,.22)',
		'easeOutQuart'   : 'cubic-bezier(.165,.84,.44,1)',
		'easeInOutQuart' : 'cubic-bezier(.77,0,.175,1)',
		'easeInQuint'    : 'cubic-bezier(.755,.05,.855,.06)',
		'easeOutQuint'   : 'cubic-bezier(.23,1,.32,1)',
		'easeInOutQuint' : 'cubic-bezier(.86,0,.07,1)',
		'easeInSine'     : 'cubic-bezier(.47,0,.745,.715)',
		'easeOutSine'    : 'cubic-bezier(.39,.575,.565,1)',
		'easeInOutSine'  : 'cubic-bezier(.445,.05,.55,.95)',
		'easeInBack'     : 'cubic-bezier(.6,-.28,.735,.045)',
		'easeOutBack'    : 'cubic-bezier(.175, .885,.32,1.275)',
		'easeInOutBack'  : 'cubic-bezier(.68,-.55,.265,1.55)'
	};

	// 转换easing为贝塞尔函数
	//
	//    'swing' => 'cubic-bezier(.25,.46,.45,.94)'
	//
	function convertEase(easing) {
		if (typeof easing !== 'string') return;
		if (easing.indexOf('cubic-bezier') !== 0) {
			easing = $.cssEase[easing];
			return convertEase(easing);
		}
		return easing;
	}

	// ## 'transform' CSS hook
	//
	//    $('div').css({ transform: 'rotate(90deg)' });
	//    $('div').css('transform'); //=> { rotate: '90deg' }
	//
	$.cssHooks.transform = {
		get: function(elem) {
			return $.data(elem, 'transform') || new Transform();
		},
		set: function(elem, v) {
			var value = v;

			if (!(value instanceof Transform)) {
				value = new Transform(value);
			}

			elem.style[support.transform] = value.toString();

			$.data(elem, 'transform', value);
		}
	};

	// ## 'filter' CSS hook
	//
	//    $('div').css({ filter: 'blur(10px)' });
	//
	$.cssHooks.filter = {
		get: function(elem) {
			return elem.style[support.filter];
		},
		set: function(elem, value) {
			elem.style[support.filter] = value;
		}
	};

	// jQuery 1.8- 不支持这些属性的前缀转换
	if (compareVersion('1.8', $.fn.jquery) > 0) {
		// ## 'transformOrigin' CSS hook
		//
		//    $('div').css({ transformOrigin: '0 0' });
		//
		$.cssHooks.transformOrigin = {
			get: function(elem) {
				return elem.style[support.transformOrigin];
			},
			set: function(elem, value) {
				elem.style[support.transformOrigin] = value;
			}
		};

		// ## 'transformStyle' CSS hook
		//
		//    $('div').css({ transformStyle: 'preserve-3d' });
		//
		$.cssHooks.transformStyle = {
			get: function(elem) {
				return elem.style[support.transformStyle];
			},
			set: function(elem, value) {
				elem.style[support.transformStyle] = value;
			}
		};

		// ## 'perspective' CSS hook
		//
		//    $('div').css({ perspective: '1000px' });
		//
		$.cssHooks.perspective = {
			get: function(elem) {
				return elem.style[support.perspective];
			},
			set: function(elem, value) {
				elem.style[support.perspective] = value;
			}
		};

		// ## 'perspectiveOrigin' CSS hook
		//
		//    $('div').css({ perspectiveOrigin: '100px 100px' });
		//
		$.cssHooks.perspectiveOrigin = {
			get: function(elem) {
				return elem.style[support.perspectiveOrigin];
			},
			set: function(elem, value) {
				elem.style[support.perspectiveOrigin] = value;
			}
		};

		// ## 'backfaceVisibility' CSS hook
		//
		//    $('div').css({ backfaceVisibility: '100px 100px' });
		//
		$.cssHooks.backfaceVisibility = {
			get: function(elem) {
				return elem.style[support.backfaceVisibility];
			},
			set: function(elem, value) {
				elem.style[support.backfaceVisibility] = value;
			}
		};

		// ## 'transition' CSS hook
		//
		//    $('div').css({ transition: 'all 0 ease 0' });
		//
		$.cssHooks.transition = {
			get: function(elem) {
				return elem.style[support.transition];
			},
			set: function(elem, value) {
				elem.style[support.transition] = value;
			}
		};
	}

	// ## compare version
	//
	//    a = '1.11.1',  b = '1.8.2'
	//    a > b return 1
	//    a < b return -1
	//    a = b return 0
	//
	function compareVersion(a, b) {
		var aa = a.split('.'),
			bb = b.split('.'),
			al = aa.length,
			bl = bb.length,
			len = Math.max(al, bl),
			aInt, bInt;
		for (; len > 0; len--) {
			aInt = parseInt(aa.shift()) || 0;
			bInt = parseInt(bb.shift()) || 0;
			if (aInt > bInt) return 1;
			else if (aInt < bInt) return -1;
		}
		return 0;
	}

	// 定义所有变换属性的 transition-property
	var propertyMap = {};

	// Register other CSS hooks
	registerCssHook('x');
	registerCssHook('y');
	registerCssHook('z');
	registerCssHook('translateX');
	registerCssHook('translateY');
	registerCssHook('translateZ');
	registerCssHook('translate');
	registerCssHook('translate3d');
	registerCssHook('scale');
	registerCssHook('scaleX');
	registerCssHook('scaleY');
	registerCssHook('scaleZ');
	registerCssHook('scale3d');
	registerCssHook('rotate');
	registerCssHook('rotateX');
	registerCssHook('rotateY');
	registerCssHook('rotateZ');
	registerCssHook('rotate3d');
	registerCssHook('skew');
	registerCssHook('skewX');
	registerCssHook('skewY');

	function registerCssHook(prop, isPixels) {
		// 所有属性都不应该被强制添加px单位，即使是 translate，因为它也可能是百分比
		if (!isPixels) {
			$.cssNumber[prop] = true;
		}

		propertyMap[prop] = support.transform;

		$.cssHooks[prop] = {
			get: function(elem) {
				var t = $.css(elem, 'transform');
				return t.get(prop);
			},

			set: function(elem, value) {
				var t = $.css(elem, 'transform');
				t.setFromString(prop, value);
				$.style(elem, 'transform', t);
			}
		};
	}

	// ## Transform class
	//
	//    var t = new Transform('rotate(90) scale(4)');
	//
	// Set properties
	//
	//    t.set('rotate', 40)
	//
	// Get properties
	//
	//    t.rotate             //=> '40deg'
	//    t.scale              //=> '4'
	//
	// The output string
	//
	//    t.toString()         //=> 'rotate(40deg) scale(4)'
	//
	function Transform(str) {
		if (typeof str === 'string') {
			this.parse(str);
		}
	}

	Transform.prototype = {
		// ### setFromString()
		//
		//    t.setFromString('scale', '2,4');  //=> ['scale', '2', '4']
		//    t.setFromString('scale', [,4]);   //=> ['scale', null, '4']
		//
		setFromString: function(prop, val) {
			var args;

			if ($.isArray(val)) {
				for (var i = 0; i < 3; i++) {
					if (val[i] === undefined) val[i] = null;
				}
				args = val;
			} else {
				args = (typeof val === 'string') ? val.split(',') : [val];
			}

			args.unshift(prop);

			Transform.prototype.set.apply(this, args);
		},

		set: function(prop) {
			var args = Array.prototype.slice.apply(arguments, [1]);
			if (this.setter[prop]) {
				this.setter[prop].apply(this, args);
			} else {
				this[prop] = args.join(',');
			}
		},

		get: function(prop) {
			if (this.getter[prop]) {
				return this.getter[prop].apply(this);
			} else {
				return this[prop];
			}
		},

		setter: {
			// ### x / y / z
			//
			//    .css({ x: 4 })       //=> 'translate(4px, 0)'
			//    .css({ y: 10 })      //=> 'translate(4px, 10px)'
			//    .css({ z: 5 })      //=> 'translate(4px, 10px) translateZ(5px)'
			//
			x: function(x) {
				this.set('translate', x, null);
			},

			y: function(y) {
				this.set('translate', null, y);
			},

			z: function(z) {
				this.setProp('translateZ', z, 'px');
			},

			translateX: function(x) {
				this.set('x', x);
			},
			translateY: function(y) {
				this.set('y', y);
			},
			translateZ: function(z) {
				this.set('z', z);
			},

			// ### translate
			//
			//    .css({ translate: '2, 5' })    //=> 'translate(2px, 5px)'
			//    .css({ translate: '' })        //=> remove 'translate(2px, 5px)'
			//
			translate: function(x, y) {
				if (y === undefined) {
					y = x;
				}
				this.setDoubleProp('translate', x, y, 'px');
			},
			// ### translate3d
			//
			//    .css('translate3d', [100,200,300]);    //=> 'translate(100px, 200px) translateZ(300px)'
			//
			translate3d: function(x, y, z) {
				if (y === undefined && z === undefined) {
					z = y = x;
				}
				this.set('translate', x, y);
				this.set('z', z);
			},

			// ### scale
			//
			//    .css({ scale: 3 })        //=> 'scale(3)'
			//    .css({ scale: '3,2' })    //=> 'scale(3,2)'
			//
			scale: function(x, y) {
				if (y === undefined) {
					y = x;
				}
				this.setDoubleProp('scale', x, y, '');
			},
			// ### scale3d
			//
			//    .css('scale3d', [1,2,3]);    //=> 'scale(1, 2) scaleZ(3)'
			//
			scale3d: function(x, y, z) {
				if (y === undefined && z === undefined) {
					z = y = x;
				}
				this.set('scale', x, y);
				this.set('scaleZ', z);
			},

			scaleX: function(x) {
				this.set('scale', x, null);
			},

			scaleY: function(y) {
				this.set('scale', null, y);
			},

			scaleZ: function(z) {
				this.setProp('scaleZ', z, '');
			},

			// ### rotate
			//
			//    .css({ rotate: 30 })
			//    .css({ rotate: '30' })
			//    .css({ rotate: '30deg' })
			//
			rotate: function(theta) {
				this.setProp('rotate', theta, 'deg');
			},

			rotateX: function(theta) {
				this.setProp('rotateX', theta, 'deg');
			},

			rotateY: function(theta) {
				this.setProp('rotateY', theta, 'deg');
			},

			rotateZ: function(theta) {
				this.set('rotate', theta);
			},

			rotate3d: function(x, y, z) {
				if (y === undefined && z === undefined) {
					z = y = x;
				}
				this.set('rotateX', x);
				this.set('rotateY', y);
				this.set('rotate', z);
			},

			skew: function(x, y) {
				if (y === undefined) {
					y = x;
				}
				this.set('skewX', x);
				this.set('skewY', y);
			},

			skewX: function(x) {
				this.setProp('skewX', x, 'deg');
			},

			skewY: function(y) {
				this.setProp('skewY', y, 'deg');
			}
		},

		getter: {
			x: function() {
				return this._translateX || 0;
			},

			y: function() {
				return this._translateY || 0;
			},

			z: function() {
				return this.translateZ || 0;
			},

			translateX: function() {
				return this.get('x');
			},
			translateY: function() {
				return this.get('y');
			},
			translateZ: function() {
				return this.get('z');
			},

			translate: function() {
				return [this.get('x'), this.get('y')];
			},

			translate3d: function() {
				return [this.get('x'), this.get('y'), this.get('z')];
			},

			scale: function() {
				var x = this.get('scaleX'),
					y = this.get('scaleY'),
					s = [x, y];

				// '2,2' => 2
				// '2,1' => [2,1]
				return (s[0] === s[1]) ? s[0] : s;
			},

			scale3d: function() {
				var x = this.get('scaleX'),
					y = this.get('scaleY'),
					z = this.get('scaleZ'),
					s = [x, y, z];

				// '2,1,2' => [2,1,2]
				return s;
			},

			scaleX: function() {
				return parseFloat(this._scaleX) || 1;
			},

			scaleY: function() {
				return parseFloat(this._scaleY) || 1;
			},

			scaleZ: function() {
				return parseFloat(this.scaleZ) || 1;
			},

			rotate: function(theta) {
				return this.rotate || 0;
			},

			rotateX: function(theta) {
				return this.rotateX || 0;
			},

			rotateY: function(theta) {
				return this.rotateY || 0;
			},

			rotateZ: function(theta) {
				return this.get('rotate');
			},

			rotate3d: function() {
					return [this.get('rotateX'), this.get('rotateY'), this.get('rotate')];
			},

			skew: function() {
				return [this.get('skewX'), this.get('skewY')];
			},

			skewX: function() {
				return this.skewX || 0;
			},

			skewY: function() {
				return this.skewY || 0;
			}
		},

		// ### setProp()
		// If the property value is an empty string, the attributes are removed
		// If the attribute values are not legal, ignore Settings
		//
		//    .css({'rotate': 30}).css({'rotate': ''})      //=> remove 'rotate(30deg)'
		//    .css({'rotate': 30}).css({'rotate': null})    //=> 'rotate(30deg)'
		//
		setProp: function(prop, value, u) {
			if (value !== undefined && value !== '') {
				if (isNaN(parseFloat(value))) {
					value = undefined;
				}
			}
			if (value === '') {
				delete this[prop];
			} else if (value !== undefined) {
				this[prop] = unit(value, u);
			}
		},

		// ### setDoubleProp()
		// If both the attribute value is empty string, the attributes are removed
		// If one of the attribute value is empty string, is set to the default value
		// If the attribute values are not legal, ignore Settings
		//
		//    .css({'scaleX': 3}).css({'scale': ''})          //=> remove 'scale(3, 1)'
		//    .css({'scaleX': 3}).css({'scale': ['',4]})      //=> 'scale(1, 4)'
		//    .css({'scaleX': 3}).css({'scale': [null,4]})    //=> 'scale(3, 4)'
		//
		// Note
		//    .css({'translate3d': '2,,'})  === .css({'translate3d': [2, '', '']})
		//    .css({'translate3d': [2,,,]}) === .css({'translate3d': '2, null, null'})
		//
		setDoubleProp: function(prop, value1, value2, u) {
			if (this['_' + prop + 'X'] === undefined) {
				this['_' + prop + 'X'] = this.get(prop + 'X');
			}
			if (this['_' + prop + 'Y'] === undefined) {
				this['_' + prop + 'Y'] = this.get(prop + 'Y');
			}

			if (value1 !== undefined && value1 !== '') {
				if (isNaN(parseFloat(value1))) {
					value1 = undefined;
				}
			}
			if (value2 !== undefined && value2 !== '') {
				if (isNaN(parseFloat(value2))) {
					value2 = undefined;
				}
			}

			if (value1 === '' && value2 === '') {
				delete this['_' + prop + 'X'];
				delete this['_' + prop + 'Y'];
				delete this[prop];
			} else {
				if (value1 === '') {
					delete this['_' + prop + 'X'];
					value1 = this.get(prop + 'X');
				} else if (value2 === '') {
					delete this['_' + prop + 'Y'];
					value2 = this.get(prop + 'Y');
				}

				if (value1 !== undefined) {
					this['_' + prop + 'X'] = unit(value1, u);
				}
				if (value2 !== undefined) {
					this['_' + prop + 'Y'] = unit(value2, u);
				}

				if (prop === 'scale') {
					this[prop] = this['_' + prop + 'X'] === this['_' + prop + 'Y'] ?
						this['_' + prop + 'X'] :
						this['_' + prop + 'X'] + ',' + this['_' + prop + 'Y'];
				} else {
					this[prop] = this['_' + prop + 'X'] + ',' + this['_' + prop + 'Y'];
				}
			}
		},

		// ### parse()
		//
		//    'rotate(90) scale(4)'  =>  self.setFromString('rotate', 90); self.setFromString('scale', 4);
		//
		parse: function(str) {
			var self = this;
			str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
				self.setFromString(prop, val);
			});
		},

		toString: function() {
			var re = [];

			for (var i in this) {
				if (this.hasOwnProperty(i)) {
					if ((!support.transform3d) && (
							(i === 'rotateX') ||
							(i === 'rotateY') ||
							(i === 'translateZ') ||
							(i === 'scaleZ') ||
							(i === 'perspective'))) {
						continue;
					}

					if (i[0] !== '_') {
						re.push(i + '(' + this[i] + ')');
					}
				}
			}

			return re.join(' ');
		}
	};


	// 调用队列
	function callOrQueue(self, queue, fn) {
		if (queue === true) {
			self.queue(fn);
		} else if (queue) {
			self.queue(queue, fn);
		} else {
			self.each(function() {
				fn.call(this);
			});
		}
	}

	// ### getProperties(dict)
	// 返回属性对应的 transition-property
	function getProperties(props) {
		var re = [];

		$.each(props, function(key) {
			key = $.camelCase(key); // Convert 'text-align' => 'textAlign'
			key = propertyMap[key] || $.cssProps[key] || key;

			// Get vendor specify propertie
			// For example 'transform-origin' 'perspective'
			if (support[key]) {
				key = uncamel(support[key]);
			}

			if ($.inArray(key, re) === -1) {
				re.push(key);
			}
		});

		return re;
	}

	// ### getTransition()
	// Returns the transition string to be used for the `transition` CSS property.
	//
	//    getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');
	//    //=> 'opacity 500ms ease, -webkit-transform 500ms ease'
	//
	function getTransition(properties, duration, easing) {
		// Get the CSS properties needed.
		var props = getProperties(properties);

		// Build the duration/easing/delay attributes for it.
		var attribs = '' + toMS(duration) + ' ' + easing;

		// For more properties, add them this way:
		// 'margin 200ms ease, padding 200ms ease, ...'
		var transitions = [];
		$.each(props, function(i, name) {
			transitions.push(name + ' ' + attribs);
		});

		return transitions.join(',');
	}

	// ## transition()
	function transition(properties, duration, easing, callback, queue) {
		var self = this;

		// Get the total time
		duration = parseInt(duration, 10);

		var finishCall = function(self, next) {
			if (typeof callback === 'function') {
				callback.apply(self);
			}
			if (typeof next === 'function') {
				next();
			}
		}

		// If there's nothing to do...
		if (duration === 0) {
			var fn = function(next) {
				$(this).css(properties);
				finishCall(this, next);
			};

			callOrQueue(self, queue, fn);
			return self;
		}

		// Build the `transition` property.
		var transitionValue = getTransition(properties, duration, easing);
		self.each(function() {
			// 用于分别保存每一个对象的 transition 属性值列表
			if (!$.isArray($.data(this, 'transitionValueList'))) $.data(this, 'transitionValueList', []);
		});

		var run = function(next) {
			var $this = $(this);
			var bound = false;

			// Prepare the callback.
			var cb = function() {
				var i = $.inArray(timer, $.timers);
				if (i >= 0) $.timers.splice(i, 1);

				if (bound) {
					$this.unbind(support.transitionEnd, cb);
				}

				i = $.inArray(transitionValue, transitionValueList);
				if (i >= 0) transitionValueList.splice(i, 1);
				this.style[support.transition] = transitionValueList.join(',');

				finishCall(this, next);
			};

			var stop = function(gotoEnd) {
				if (bound) {
					if (bound === true) {
						$this.unbind(support.transitionEnd, cb);
					} else {
						window.clearTimeout(bound);
					}
				}

				var i = $.inArray(transitionValue, transitionValueList);
				if (i >= 0) transitionValueList.splice(i, 1);
				this.style[support.transition] = transitionValueList.join(',');

				if (gotoEnd) {
					finishCall(this, next);
				} else {
					var bezierY = cubicBezier.getY(($.now() - startTime) / duration);
					var curProp = {};
					for (var p in properties) {
						var v = properties[p],
							u = getUnit(v);
						curProp[p] = (parseFloat(v) - startProp[p]) * bezierY + startProp[p] + u;
					}
					$this.css(curProp);
				}
			};

			// 模拟 .stop() 所需要的对象
			var timer = function() {
				// 当在 animate() 之后 调用 transit() 时
				// 在 animate 动画完成后，且下一个队列函数已经执行，timer 被加入到 $.timers 队列中后，此时 jQuery 又会执行一次 jQuery.fx.tick
				// 在 jQuery.fx.tick 中 $.timers 会将返回值为 false 的 timer 全部清空，这样会导致当前的动画无法执行 stop()
				// 注释：animate 的动画中 timer() 的返回值为当前动画的剩余时间
				return true;
			};
			timer.elem = this;
			timer.queue = queue;
			timer.anim = { stop: $.proxy(stop, this) };
			$.timers.push(timer);

			if (support.transitionEnd) {
				bound = true;
				$this.bind(support.transitionEnd, cb);
			} else {
				// Fallback to timers if the 'transitionend' event isn't supported.
				bound = window.setTimeout($.proxy(cb, this), duration);
			}

			// 创建三次贝塞尔对象
			var cubicBezier = createCubicBezier(easing);
			var startTime = $.now();
			var startProp = {};
			for (var p in properties) {
				var v = parseFloat($this.css(p));
				startProp[p] = isNaN(v) ? 0 : v; // 主要针对定位属性，如：left默认为auto
				$this.css(p, startProp[p]);
				$this.css(p); // 强制刷新
			}

			// Apply transitions.
			var transitionValueList = $.data(this, 'transitionValueList');
			transitionValueList.push(transitionValue);
			this.style[support.transition] = transitionValueList.join(',');

			$this.css(properties);
		};

		// Defer running. This allows the browser to paint any pending CSS it hasn't
		// painted yet before doing the transitions.
		var deferredRun = function(next) {
			this.offsetWidth; // force a repaint
			run.call(this, next);
		};

		// 模拟 .finish() 所需要的方法
		deferredRun.finish = function() {
			$(this).css(properties);
			finishCall(this);
		};

		// Use jQuery's fx queue.
		callOrQueue(self, queue, deferredRun);

		return self;
	}


	// ### Compatible with the following written
	// Example:
	//    .animate.({'translate3d': [100, 200, 300]});
	//    .animate.({'scale': [1, 2]});
	//    .animate.({'scale': '1,2'});
	var _animate = $.fn.animate;
	var xyz = ['X', 'Y', 'Z'];
	var checkProp = [
		'translate',
		'translate3d',
		'scale',
		'scale3d',
		'rotate3d',
		'skew'
	];

	$.fn.animate = function(properties, duration, easing, callback) {
		var queue = true;
		var originalDuration = duration;
		var originalEasing = easing;

		if (typeof duration === 'function') { // Account for `.transition(properties, callback)`.
			callback = duration;
			duration = undefined;
		} else if (typeof duration === 'object') { // Account for `.transition(properties, options)`.
			easing = duration.easing;
			queue = typeof duration.queue === 'undefined' ? true : duration.queue;
			callback = duration.complete;
			duration = duration.duration;
		} else if (typeof easing === 'function') { // Account for `.transition(properties, duration, callback)`.
			callback = easing;
			easing = undefined;
		}
		// Set defaults. (`400` duration, `ease` easing)
		if (typeof duration === 'undefined') {
			duration = $.fx.speeds._default;
		}
		if (typeof easing === 'undefined') {
			easing = $.cssEase._default;
		}

		// 拆分属性
		resolveProp(properties);
		// 确保缓动为贝塞尔函数
		easing = convertEase(easing);
		// 如果不支持 transition 动画，或者不支持该缓动类型，则回退到 animate 实现
		if (!support.transition || typeof easing === 'undefined') {
			return _animate.apply(this, [properties, originalDuration, originalEasing, callback]);
		}

		// Solve the <img> (x, y) animation bug always starting from 0
		this.each(function() {
			if (this.x != null) delete this.x;
			if (this.y != null) delete this.y;
		});

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( queue == null || queue === true ) {
			queue = "fx";
		}

		return transition.apply(this, [properties, duration, easing, callback, queue]);
	}

	// ### resolveProp(prop)
	//
	//    {scale: '3,2'} => {scaleX: 3, scaleY: 2}
	//
	function resolveProp(prop) {
		for (var i = 0, l = checkProp.length; i < l; i++) {
			var p = checkProp[i];
			if (p in prop) {
				var val = prop[p];
				delete prop[p];

				var is3d = p.indexOf('3d') !== -1,
					arr;
				if (val.constructor !== Array) {
					arr = (typeof val === 'string') ? val.split(',') : [val];
					if (arr.length < 2) {
						if (is3d) {
							arr[2] = arr[1] = arr[0];
						} else {
							arr[1] = arr[0];
						}
					}
				} else {
					arr = val;
				}

				if (is3d) p = p.slice(0, -2);
				var def = p === 'scale' ? 1 : 0;

				for (var j = 0; j < 3; j++) {
					val = arr[j];
					if (val || val === 0) {
						prop[p + xyz[j]] = val;
					} else if (val === '') {
						prop[p + xyz[j]] = def;
					}
				}
			}
		}
	}



	// ### uncamel(str)
	// Converts a camelcase string to a dasherized string.
	//
	//    'marginLeft' => 'margin-left'
	//
	function uncamel(str) {
		return str.replace(/([A-Z])/g, function(letter) {
			return '-' + letter.toLowerCase();
		});
	}

	// ### unit(number, unit)
	//
	//    unit(30, 'px')      //=> '30px'
	//    unit('30%', 'px')   //=> '30%'
	//
	function unit(i, units) {
		if ((typeof i === 'string') && (!i.match(/^[\-0-9\.]+$/))) {
			return i;
		} else {
			return '' + i + units;
		}
	}

	// ### getUnit(str)
	//
	//    getUnit('30px')      //=> 'px'
	//    getUnit('30%')       //=> '%'
	//
	function getUnit(value) {
		if (typeof value !== 'string') return '';
		var s = value.match(/^[\-0-9\.]+/);
		if (!s) return '';
		return value.substr(s[0].length);
	}

	// ### toMS(duration)
	// Converts given `duration` to a millisecond string.
	//
	//    toMS('fast') => $.fx.speeds[i] => '200ms'
	//    toMS('normal') //=> $.fx.speeds._default => '400ms'
	//    toMS(10) //=> '10ms'
	//    toMS('100ms') //=> '100ms'
	//
	function toMS(duration) {
		var i = duration;

		// Allow string durations like 'fast' and 'slow', without overriding numeric values.
		if (typeof i === 'string' && (!i.match(/^[\-0-9\.]+/))) {
			i = $.fx.speeds[i] || $.fx.speeds._default;
		}

		return unit(i, 'ms');
	}

	// ### getArg(str)
	// 获取字符串表达式中括号内的参数数组
	//
	//    'cubic-bezier(0,0,1,1)' => [0,0,1,1]
	//
	function getArg(str) {
		var s = str.match(/\(.*\)$/);
		if (s) {
			var args = s[0].slice(1, -1).split(',');
			for (var i = 0, l = args.length; i < l; i++) {
				var arg = parseFloat(args[i]);
				args[i] = isNaN(arg) ? undefined : arg;
			}
			return args;
		}
		return null;
	}

	// 根据缓动函数，创建三次贝塞尔对象
	function createCubicBezier(easing) {
		var args = getArg(easing);
		return new CubicBezier([args[0], args[1]], [args[2], args[3]]);
	}

	/**
	 * @author 创建一个三次贝塞尔对象
	 * @exception 每一个参数为一个表示点的数组[x,y]
	 * @param {array} c1 表示起始点的控制点
	 * @param {array} c2 表示结束点的控制点
	 * @param {array} begin 表示起始点，默认为[0,0]
	 * @param {array} end 表示结束点，默认为[1,1]
	 */
	function CubicBezier(c1, c2, begin, end) {
		this.c1 = new Point(c1[0], c1[1]);
		this.c2 = new Point(c2[0], c2[1]);
		this.begin = begin ? new Point(begin[0], begin[1]) : new Point(0, 0);
		this.end = end ? new Point(end[0], end[1]) : new Point(1, 1);
	}

	CubicBezier.prototype = {
		_bezierFunc: function(p, t, targ) {
			return this.begin[p] * Math.pow(1 - t, 3) +
				this.c1[p] * 3 * t * Math.pow(1 - t, 2) +
				this.c2[p] * 3 * (1 - t) * Math.pow(t, 2) +
				this.end[p] * Math.pow(t, 3) -
				targ;
		},

		_deltaBezierFunc: function(p, t, targ) {
			var dt = 1e-8;
			return (this._bezierFunc(p, t, targ) - this._bezierFunc(p, t - dt, targ)) / dt;
		},

		/**
		 * @author 已知x，求y
		 * @param {number} x 参数表示一个在贝塞尔曲线上X轴方向的向量，取值在 0.0 - 1.0 之间
		 * @return 返回x在贝塞尔曲线上对应的y
		 */
		getY: function(x) {
			var t = .5; //设置t的初值
			for (var i = 0; i < 1000; i++) {
				t = t - this._bezierFunc('x', t, x) / this._deltaBezierFunc('x', t, x);
				if (this._bezierFunc('x', t, x) === 0) break;
			}
			return this._bezierFunc('y', t, 0);
		}

	}

	// ## Point class
	function Point(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	return $;
}));
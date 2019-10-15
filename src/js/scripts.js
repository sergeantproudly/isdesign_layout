var __widthMobile = 1000;
var __widthMobileDesktopSmall = 1220;
var __widthMobileTablet = 1000;
var __widthMobileTabletMiddle = 850;
var __widthMobileTabletSmall = 600;
var __widthMobileSmall = 540;
var __isMobile = ($(window).width() <= __widthMobile);
var __isMobileDesktopSmall = ($(window).width() <= __widthMobileDesktopSmall);
var __isMobileTablet = ($(window).width() <= __widthMobileTablet);
var __isMobileTabletMiddle = ($(window).width() <= __widthMobileTabletMiddle);
var __isMobileTabletSmall = ($(window).width() <= __widthMobileTabletSmall);
var __isMobileSmall = ($(window).width() <= __widthMobileSmall);
var __animationSpeed = 350;

function initElements(element) {
	$element=$(element ? element : 'body');

	$(window).on('resize',function(){
		onResize();
	});

	$.widget('app.selectmenu', $.ui.selectmenu, {
		_drawButton: function() {
		    this._super();
		    var selected = this.element
		    .find('[selected]')
		    .length,
		        placeholder = this.options.placeholder;

		    if (!selected && placeholder) {
		      	this.buttonItem.text(placeholder).addClass('placeholder');
		    } else {
		    	this.buttonItem.removeClass('placeholder');
		    }
		}
	});

	$.datepicker.regional['ru']={
           closeText: 'Закрыть',
           prevText: '&#x3c;Пред',
           nextText: 'След&#x3e;',
           currentText: 'Сегодня',
           monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
           monthNamesShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
           dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
           dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
           dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
           weekHeader: 'Нед',
           dateFormat: 'dd.mm.yy',
           firstDay: 1,
           isRTL: false,
           showMonthAfterYear: false,
           yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['ru']);

	$element.find('select').each(function(i, select) {
		// editable select
		if (typeof($(select).attr('editable')) != 'undefined' && $(select).attr('editable') !== 'false') {
			$(select).editableSelect({ 
				effects: 'fade',
				source: $(select).attr('source') ? $(select).attr('source') : false
			}).on('change.editable-select', function(e) {
				var $holder = $(e.target).closest('.input-holder');
				if ($holder.find('.es-input').val()) {
					$(e.target).closest('.input-holder').addClass('focused');
				} else {
					$(e.target).closest('.input-holder').removeClass('focused');
				}
			});

		// simple select
		} else {
			if ($(select).offset().left + 370 > $(window).width()) {
				$(select).attr('data-pos', 'right');
			}

			var offset = $(select).attr('data-offset');
			if ($(select).attr('data-pos') == 'right') {
				var data = {
					position: {my : "right"+(offset?"+"+offset:"")+" top-2", at: "right bottom"}
				}
			} else {
				var data = {
					position: {my : "left"+(offset?"+"+offset:"")+" top-2"}
				}
			}
			if (typeof($(select).attr('placeholder')) != 'undefined') {
				data['placeholder'] = $(select).attr('placeholder');
			}
			data['change'] = function(e, ui) {
				$(ui.item.element).closest('.input-holder').addClass('focused');
			}
			data['appendTo'] = $(select).parent();
			$(select).selectmenu(data);
			if (typeof($(select).attr('placeholder')) != 'undefined') {
				$(select).prepend('<option value="" disabled selected>' + data['placeholder'] + '</option>');
			}
		}
	});

	$element.find('.js-date').each(function(index,input){
		var datepicker_options = {
			inline: true,
			language: 'ru',
		    changeYear: true,
		    changeMonth: true,
		    showOtherMonths: true
		};
		var minYear=$(input).attr('data-min-year');
		if(minYear) datepicker_options.minDate='01.01.'+minYear;
		else minYear='c-10';
		var maxYear=$(input).attr('data-max-year');
		if(maxYear) datepicker_options.maxDate='01.01.'+maxYear;
		else maxYear='c+10';
		var defaultDate=$(input).attr('data-default-date');
		if(defaultDate) datepicker_options.defaultDate=defaultDate;
		datepicker_options.yearRange=[minYear,maxYear].join(':');
		
		$(input).attr('type','text').datepicker(datepicker_options).addClass('date').val($(input).attr('value')).after('<i></i>');
		$(input).next('i').click(function() {
			$(this).prev('input').datepicker('show');
			//initElements($('#ui-datepicker-div'));
		});
	});

	$element.find('input[type="checkbox"], input[type="radio"]').checkboxradio();

	$element.find('.file-upload').each(function(index, block) {
		$(block).find('.label').click(function(e){
			e.preventDefault();
		});
	});

	$element.find('.modal-close, .close-btn, .modal .js-cancel').click(function(e) {
		e.preventDefault();
		e.stopPropagation();

		/*
		if ($element.find('.modal-wrapper:visible').length > 1) {
			$element.find('.modal-wrapper[data-transparent]').stop().animate({'opacity': 1}, __animationSpeed);
			hideModal(this, true);
		} else {
			hideModal(this, false);
		}
		*/
		hideModal(this, false);
	});

	$element.find('.tabs, .js-tabs').lightTabs();

	$element.find('.js-scroll').each(function(index, block) {
		if (!$(block).attr('data-on-demand')) {
			scrollInit(block);
		}
	});

	$('body').mouseup(function(e) {
		/*
		if ($('.modal-fadeout').css('display') == 'block' && !$('html').hasClass('html-mobile-opened')) {
			if (!$(e.target).closest('.contents').length && !$(e.target).closest('.ui-selectmenu-menu').length && !$(e.target).closest('.ui-datepicker').length) {
				hideModal();
			}
		}
		*/
		if ($('html').hasClass('html-mobile-opened')) {
			if (!$(e.target).closest('.menu-holder').length) {
				$('nav .close').click();
			}
		}

	}).keypress(function(e){
		if (!e)e = window.event;
		var key = e.keyCode||e.which;

		if ($('.modal-fadeout').css('display') == 'block') {			
			if (key == 27) {
				hideModal();
			} 
		}
		if ($('html').hasClass('html-mobile-opened')) {
			if (key == 27) {
				$('nav .close').click();
			}
		}
	});

	$element.find('.input-holder input').keydown(function() {
		if ($(this).val()) {
			$(this).parent('.input-holder').addClass('focused');
		}
	}).keyup(function() {
		if (!$(this).val()) {
			$(this).parent('.input-holder').removeClass('focused');
		}
	}).focusout(function() {
		if (!$(this).val()) {
			$(this).parent('.input-holder').removeClass('focused');
		}
	}).each(function(i, item) {
		if ($(item).val()) {
			$(item).parent('.input-holder').addClass('focused');
		}
	});

	$element.find('textarea.js-autoheight').each(function(i, textarea) {
		if (!$(textarea).data('autoheight-inited')) {
			$(textarea).attr('rows', 1);
			$(textarea).on('input', function() {
				$(this).css('height', 'auto');
        		if ($(this)[0].scrollHeight > 0) $(this).css('height', $(this)[0].scrollHeight+'px');
			});
			if ($(textarea).css('display') != 'none') $(textarea).trigger('input');
			$(textarea).data('autoheight-inited', true);
		}
	});

	fadeoutInit();
}

var resizeCallbacks = [
];
function onResize() {
	__isMobile = ($(window).width() <= __widthMobile);
	__isMobileTablet = ($(window).width() <= __widthMobileTablet);
	__isMobileTabletMiddle = ($(window).width() <= __widthMobileTabletMiddle);
	__isMobileTabletSmall = ($(window).width() <= __widthMobileTabletSmall);

	fadeoutInit();

	$.each(resizeCallbacks, function(i, func) {
		func();
	});
}

function parseUrl(url) {
	if (typeof(url) == 'undefined') url=window.location.toString();
	var a = document.createElement('a');
	a.href = url;

	var pathname = a.pathname.match(/^\/?(\w+)/i);	

	var parser = {
		'protocol': a.protocol,
		'hostname': a.hostname,
		'port': a.port,
		'pathname': a.pathname,
		'search': a.search,
		'hash': a.hash,
		'host': a.host,
		'page': pathname?pathname[1]:''
	}		

	return parser;
} 

function showModal(modal_id, dontHideOthers) {
	var $modal = $('#' + modal_id);

	if (typeof(dontHideOthers) == 'undefined' || !dontHideOthers) $('.modal-wrapper:visible').not($modal).attr('data-transparent', true).stop().animate({'opacity': 0}, __animationSpeed);

	var display = __isMobileTablet ? 'block' : 'table';
	if (modal_id == 'modal-geo' && __isMobileTablet && !__isMobileTabletMiddle) {
		display = 'table';
	}

	$('.modal-fadeout').stop().fadeIn(300);
	$modal.stop().fadeIn(450).css({
		'display': display,
		'top': $(window).scrollTop()
	});

	var oversize = $(window).height() < $modal.find('.contents').outerHeight(true);

	if ($modal.attr('data-long') || oversize) {
		$('html').addClass('html-modal-long');

		if (oversize && __isMobile) {
			var modalHeight = $modal.outerHeight();
			$('#layout').data('scrollTop', $(window).scrollTop()).addClass('js-modal-overflow').height(modalHeight);
			$modal.css('top', 0);
			$('html,body').scrollTop(0);
		}
	} else {
		$('html').addClass('html-modal');
	}

	$modal.find('.js-scroll').each(function(index, block) {
		scrollInit(block);
	});
}

function hideModal(sender, onlyModal) {
	var $modal = sender ? $(sender).closest('.modal-wrapper') : $('.modal-wrapper:visible');
	if (typeof(onlyModal) == 'undefined' || !onlyModal) {
		$('.modal-fadeout').stop().fadeOut(300);
		if ($('#layout').data('scrollTop')) {
			var savedScrollTop =$('#layout').data('scrollTop');
			$('#layout').removeClass('js-modal-overflow').height('auto').removeData('scrollTop');
			$('html,body').scrollTop(savedScrollTop);
		}
		$modal.stop().fadeOut(450, function() {
			$('html').removeClass('html-modal html-modal-long');
		});
	} else {
		$modal.stop().fadeOut(450);
	}
}

function closeModal(sender) {
	if ($('.modal-wrapper:visible').length > 1) {
		$('.modal-wrapper[data-transparent]').stop().animate({'opacity': 1}, __animationSpeed);
		hideModal(sender, true);
	} else {
		hideModal(sender, false);
	}
}

function showModalConfirm(header, btn, action) {
	if (typeof(header) != 'undefined' && header) $('#modal-confirm>.modal>.contents>h1').text(header);
	if (typeof(btn) != 'undefined' && btn) $('#modal-confirm-action-btn').text(btn);
	if (typeof(action) == 'function') {
		$('#modal-confirm-action-btn').click(function(e) {
			e.preventDefault();
			e.stopPropagation();

			action();
			hideModal(this, $('.modal-wrapper:visible').length > 1);
		});
	}
	showModal('modal-confirm', true);
}

function scrollInit(block) {
	if (!$(block).data('inited')) {
		var maxHeight = $(block).attr('data-max-height');
		if (maxHeight < 0) maxHeight = $(block).parent().height() - Math.abs(maxHeight);
		if (maxHeight && $(block).outerHeight() > maxHeight) {
			$(block).css('max-height', maxHeight + 'px').jScrollPane({
					showArrows: false,
					mouseWheelSpeed: 20,
					autoReinitialise: true,
					verticalGutter: 0,
					verticalDragMinHeight: 36
				}
			);
		}
		$(block).data('inited', true);
	}
}

function fadeoutInit(node) {
	$node = $(typeof(node) == 'undefined' ? 'body' : node);
	$node.find('.js-fadeout').each(function(i, block) {
		if (!$(block).data('inited')) {
			var $holder = $('<div class="fadeout-holder"></div>').insertAfter($(block));
			$holder.html($(block));
			$(block).data('inited', true);
		}

		if (typeof($(block).attr('data-nowrap')) != 'undefined' && $(block).attr('data-nowrap') != false && $(block).attr('data-nowrap') != 'false') {
			$(block).addClass('nowrap');
		}
		$(block).scrollLeft(0);
		var w_child = 0;
		var range = document.createRange();

		$.each(block.childNodes, function(i, node) {
			if (node.nodeType != 3) {
				w_child += $(node).outerWidth(true);
			} else {
				if (typeof(range) != 'undefined') {
					range.selectNodeContents(node);
					var size = range.getClientRects();
					if (typeof(size) != 'undefined' && typeof(size[0]) != 'undefined' && typeof(size[0]['width'] != 'undefined')) w_child += size[0]['width'];
				}
			}
		});

		var maxWidth = $(block).attr('data-max-width');
		var cloneWidth = $(block).attr('data-clone-width');
		var mobileOnly = $(block).attr('data-mobile-only');

		if (!mobileOnly || (mobileOnly && __isMobileTablet)) {
			if (cloneWidth) {
				$(block).width($(cloneWidth).width());
			}
			var holderWidth = $(block).width();
			if (w_child > holderWidth && (!maxWidth || $(window).width() <= maxWidth)) {
				$(block).addClass('fadeout').removeClass('nowrap').swipe({
					swipeStatus: function(event, phase, direction, distance) {
						var offset = distance;

						if (phase === $.fn.swipe.phases.PHASE_START) {
							var origPos = $(this).scrollLeft();
							$(this).data('origPos', origPos);

						} else if (phase === $.fn.swipe.phases.PHASE_MOVE) {
							var origPos = $(this).data('origPos');

							if (direction == 'left') {
								var scroll_max = $(this).prop('scrollWidth') - $(this).width();
								var scroll_value_new = origPos - 0 + offset;
								$(this).scrollLeft(scroll_value_new);
								if (scroll_value_new >= scroll_max) $(this).addClass('scrolled-full');
								else $(this).removeClass('scrolled-full');

							} else if (direction == 'right') {
								var scroll_value_new = origPos - offset;
								$(this).scrollLeft(scroll_value_new);
								$(this).removeClass('scrolled-full');
							}

						} else if (phase === $.fn.swipe.phases.PHASE_CANCEL) {
							var origPos = $(this).data('origPos');
							$(this).scrollLeft(origPos);

						} else if (phase === $.fn.swipe.phases.PHASE_END) {
							$(this).data('origPos', $(this).scrollLeft());
						}
					},
					threshold: 70,
					preventDefaultEvents: false
				});
			} else {
				$(block).removeClass('fadeout');
			}
		}
	});
}

function editableSelectReinit(select) {
	if (typeof(select) == 'string') var $select = $('#' + select);
	else $select = $(select);

	var id = $select.attr('id');
	$('#' + id + '_es').remove();
	$select.data('editable-select', false);
	$select.editableSelect({ 
		effects: 'fade',
		source: $select.attr('source') ? $select.attr('source') : false
	}).on('change.editable-select', function(e) {
		var $holder = $(e.target).closest('.input-holder');
		if ($holder.find('.es-input').val()) {
			$(e.target).closest('.input-holder').addClass('focused');
		} else {
			$(e.target).closest('.input-holder').removeClass('focused');
		}
	});
	$('#' + id + '_input').show();
	return true;
}

function getOffsetSum(elem) {
	var t = 0, l = 0;
	while (elem) {
		t += t + parseFloat(elem.offsetTop);
		l += l + parseFloat(elem.offsetLeft);
		elem = elem.offsetParent;
	}
	return {top: Math.round(t), left: Math.round(l)};
}
function getOffsetRect(elem) {
	var box = elem.getBoundingClientRect();
	var body = document.body;
	var docElem = document.documentElement;
	var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
	var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
	var clientTop = docElem.clientTop || body.clientTop || 0;
	var clientLeft = docElem.clientLeft || body.clientLeft || 0;
	var t  = box.top +  scrollTop - clientTop;
	var l = box.left + scrollLeft - clientLeft;
	return {top: Math.round(t), left: Math.round(l)};
}
function getOffset(elem) {
	if (elem.getBoundingClientRect) {
		return getOffsetRect(elem);
	} else {
		return getOffsetSum(elem);
	}
}

// Animated scroll to target
function _scrollTo(target, offset) {
	var wh = $(window).height();
	if (typeof(offset) == 'undefined') offset = Math.round($(target).outerHeight() /2) - Math.round(wh / 2);
	else if (offset === false) offset = 0;
	$('html,body').animate({
		scrollTop: $(target).offset().top + offset
	}, 1000);
}

(function ($) {
	$.fn.lightTabs = function() {
		var showTab = function(tab, saveHash) {;
			if (!$(tab).hasClass('tab-act')) {
				var tabs = $(tab).closest('.tabs');

				var target_id = $(tab).attr('href');
		        var old_target_id = $(tabs).find('.tab-act').attr('href');
		        $(target_id).show();
		        $(old_target_id).hide();
		        $(tabs).find('.tab-act').removeClass('tab-act');
		        $(tab).addClass('tab-act');

		        if (typeof(saveHash) != 'undefined' && saveHash) history.pushState(null, null, target_id);
			}
		}

		var initTabs = function() {
            var tabs = this;
            
            $(tabs).find('a').each(function(i, tab){
                $(tab).click(function(e) {
                	e.preventDefault();

                	showTab(this, true);
                	fadeoutInit();

                	return false;
                });
                if (i == 0) showTab(tab);                
                else $($(tab).attr('href')).hide();
            });	

            $(tabs).swipe({
				swipeStatus: function(event, phase, direction, distance) {
					var offset = distance;

					if (phase === $.fn.swipe.phases.PHASE_START) {
						var origPos = $(this).scrollLeft();
						$(this).data('origPos', origPos);

					} else if (phase === $.fn.swipe.phases.PHASE_MOVE) {
						var origPos = $(this).data('origPos');

						if (direction == 'left') {
							var scroll_max = $(this).prop('scrollWidth') - $(this).width();
							var scroll_value_new = origPos - 0 + offset;
							$(this).scrollLeft(scroll_value_new);
							if (scroll_value_new >= scroll_max) $(this).addClass('scrolled-full');
							else $(this).removeClass('scrolled-full');

						} else if (direction == 'right') {
							var scroll_value_new = origPos - offset;
							$(this).scrollLeft(scroll_value_new);
							$(this).removeClass('scrolled-full');
						}

					} else if (phase === $.fn.swipe.phases.PHASE_CANCEL) {
						var origPos = $(this).data('origPos');
						$(this).scrollLeft(origPos);

					} else if (phase === $.fn.swipe.phases.PHASE_END) {
						$(this).data('origPos', $(this).scrollLeft());
					}
				},
				threshold: 70
			});	
        };

        return this.each(initTabs);
    };

	$(function () {
		initElements();

		// CHECK HASH FOR TABS
		var url_data = parseUrl();
		$('.tabs, .js-tabs').find('a').each(function(i, link) {
			if (url_data.hash == $(link).attr('href')) {
				$(link).click();
			}
		});

		// FOOTER
		resizeCallbacks.push(function() {
			if (__isMobileTabletMiddle) {
				$('footer .footer-top-link').appendTo($('footer'));
			} else {
				$('footer .footer-top-link').insertAfter('footer .footer-top');
			}
		});

		onResize();

		// BURGER
		$('#menu-holder').click(function() {
			if ((__isMobile || __isMobileDesktopSmall) && !$('body').hasClass('mobile-opened')) {
				if (!$('header').children('.close').data('inited')) {
					if (!$('header>.close').length) {
						$('header').append('<div class="close"></div>');
					}
					$('header').children('.close').click(function(e) {
						e.stopPropagation();

						$('body').removeClass('mobile-opened');
						$('#layout').height('auto').removeClass('js-modal-overflow');
						//$('.modal-fadeout').stop().fadeOut(300);	
					}).data('inited', true);
				}

				$('body').addClass('mobile-opened');

				if ($('header>.holder').outerHeight() > $(window).height()) {
					$('html').addClass('html-mobile-long');
				} else {
					$('html').removeClass('html-mobile-long');
				}

				$('#layout').addClass('js-modal-overflow').height($('header').outerHeight());

				//$('.modal-fadeout').stop().fadeIn(300);
			}
		});
		$('#menu-holder ul>li.dropdown>a').click(function(e) {
			if (__isMobile || __isMobileDesktopSmall) {
				e.preventDefault();
				if (!$(this).parent().hasClass('opened')) {
					$(this).parent().addClass('opened').children('ul').stop().slideDown(__animationSpeed, function() {
						var padds = parseInt($('header').css('padding-top')) + parseInt($('header').css('padding-bottom'));
						console.log($('header>.holder').css('padding-top'));
						$('html').toggleClass('html-mobile-long', $('#menu-holder').outerHeight() + padds > $(window).height());
						$('#layout').addClass('js-modal-overflow').height($('#menu-holder').outerHeight() + padds - 2);
					});
				} else {
					var padds = parseInt($('header').css('padding-top')) + parseInt($('header').css('padding-bottom'));
					$(this).parent().removeClass('opened').children('ul').stop().slideUp(__animationSpeed, function() {
						$('html').toggleClass('html-mobile-long', $('#menu-holder').outerHeight() +padds > $(window).height());
						$('#layout').addClass('js-modal-overflow').height($('#menu-holder').outerHeight() + padds);
					});
				}
			}
		});

		// ANCHORS
		$('.js-anchor').click(function(e) {
			e.preventDefault();
			_scrollTo($(this).attr('href'));
		});

		// MODAL LINKS
		$('.js-modal-link').click(function(e) {
			e.preventDefault();
			showModal($(this).attr('href').substring(1));
		});

		// SLICKS
		$('.js-slider').each(function(i, slider) {
			var mobile = $(slider).attr('data-mobile');
			var adaptive = $(slider).attr('data-adaptive');
			var dots = $(slider).attr('data-dots') === 'false' ? false : true;
			var arrows = $(slider).attr('data-arrows') === 'true' ? true : false;
			var autoplay = $(slider).attr('data-autoplay') ? $(slider).attr('data-autoplay') : false;
			var slidesToShow = adaptive ? Math.floor($(slider).outerWidth() / $(slider).children('li, .li').outerWidth()) : 1;

			if (mobile) {
				if ((mobile === 'true' && __isMobile) ||
					(mobile === 'middle' && __isMobileTabletMiddle) ||
					(mobile === 'small' && __isMobileTabletSmall) ||
					(mobile === 'mobile' && __isMobileSmall)) {					

					$(slider).slick({
						slidesToShow: slidesToShow,
						slidesToScroll: slidesToShow,
						dots: dots,
						arrows: arrows,
						autoplay: autoplay
					});
				}
			} else {
				$(slider).slick({
					slidesToShow: slidesToShow,
					slidesToScroll: slidesToShow,
					dots: dots,
					arrows: arrows,
					autoplay: autoplay
				});
			}
		});

		// SLIDER
		if ($('#slider').length) {
			var sliderAutoSeconds = $('#slider').attr('data-autochange-interval-sec');
			var $items = $('#slider>.slide');
			var sliderTid;
			$('#slider').data('indexCurr', 0);

			function sliderSlide(indexNext) {
				var $items = $('#slider>.slide');
				var indexCurr = $('#slider').data('indexCurr');
				if (typeof(indexNext) == 'undefined') {
					indexNext = (indexCurr < ($items.length - 1)) ? (indexCurr - 0 + 1) : 0;
				}else if(indexNext == -1) {
					indexNext = (indexCurr > 0) ? (indexCurr - 1) : ($items.length - 1);
				}

				$items.eq(indexCurr).removeClass('active');
				$items.eq(indexNext).addClass('active');

				$('#slider').data('indexCurr', indexNext);
			}

			function sliderAutoSet() {
				sliderTid = setInterval(function() {
					sliderSlide();
				}, sliderAutoSeconds * 1000);
			}

			function sliderAutoHold() {
				clearInterval(sliderTid);
				sliderAutoSet();
			}

			$('#slider').swipe({
				swipeLeft: function() {
					sliderAutoHold();
					sliderSlide();
				},
				swipeRight: function() {
					sliderAutoHold();
					sliderSlide(-1);
				},
				threshold: 35
			});

			$('#slider .nav-btn>.prev').click(function() {
				sliderAutoHold();
				sliderSlide(-1);
			});
			$('#slider .nav-btn>.next').click(function() {
				sliderAutoHold();
				sliderSlide();
			});

			$items.on({
				mouseenter: function() {
					clearInterval(sliderTid);
				},
				mouseleave: function() {
					sliderAutoHold();
				}
			});

			sliderAutoSet();
		}

		// PROJECTS
		if ($('.projects .slider').length && false) {
			$('.projects .slider').each(function(index, slider) {
				var sliderAutoSeconds = $('slider').attr('data-autochange-interval-sec');
				var $items = $('#slider>.slide');
				var $navItems = $('#slider .nav>li');
				var sliderTid;
				$(slider).data('indexCurr', 0);

				function projectsSliderSlide(slider, indexNext) {
					var $items = $(slider).children('.slide');
					var indexCurr = $(slider).data('indexCurr');
					if (typeof(indexNext) == 'undefined') {
						indexNext = (indexCurr < ($items.length - 1)) ? (indexCurr - 0 + 1) : 0;
					}else if(indexNext == -1) {
						indexNext = (indexCurr > 0) ? (indexCurr - 1) : ($items.length - 1);
					}

					$items.eq(indexCurr).removeClass('active');
					$items.eq(indexNext).addClass('active');

					$(slider).data('indexCurr', indexNext);
				}

				function projectsSliderAutoSet(slider) {
					sliderTid = setInterval(function() {
						projectsSliderSlide(1, slider);
					}, sliderAutoSeconds * 1000);
				}

				function projectsSliderAutoHold(slider) {
					clearInterval(sliderTid);
					projectsSliderAutoSet(slider);
				}

				$(slider).swipe({
					swipeLeft: function() {
						projectsSliderAutoHold(slider);
						projectsSliderSlide(slider);
					},
					swipeRight: function() {
						projectsSliderAutoHold(slider);
						projectsSliderSlide(-1);
					},
					threshold: 35
				});

				$(slider).find('.nav-btn>.prev').click(function() {
					projectsSliderAutoHold();
					projectsSliderSlide(-1);
				});
				$(slider).find('.nav-btn>.next').click(function() {
					projectsSliderAutoHold();
					projectsSliderSlide();
				});

				$items.on({
					mouseenter: function() {
						clearInterval(sliderTid);
					},
					mouseleave: function() {
						projectsSliderAutoHold(slider);
					}
				});

				projectsSliderAutoSet(slider);
			});
		}

	})
})(jQuery)
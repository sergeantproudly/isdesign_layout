(function ($) {
	$(function () {
		
		function getCookie(name) {
		  var matches = document.cookie.match(new RegExp(
		    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		  ));
		  return matches ? decodeURIComponent(matches[1]) : undefined;
		}
		
		function setCookie(name, value, options) {
		  options = options || {};		
		  var expires = options.expires;		
		  if (typeof expires == "number" && expires) {
		    var d = new Date();
		    d.setTime(d.getTime() + expires * 1000);
		    expires = options.expires = d;
		  }
		  if (expires && expires.toUTCString) {
		    options.expires = expires.toUTCString();
		  }		
		  value = encodeURIComponent(value);		
		  var updatedCookie = name + "=" + value;		
		  for (var propName in options) {
		    updatedCookie += "; " + propName;
		    var propValue = options[propName];
		    if (propValue !== true) {
		      updatedCookie += "=" + propValue;
		    }
		  }		
		  document.cookie = updatedCookie;
		}
		
		function deleteCookie(name) {
		  setCookie(name, "", {
		    expires: -1
		  })
		}
		
		
		var noticed = getCookie('cookie_notice');
		if (typeof(noticed) == 'undefined' || noticed != 1){
			$('body').append('<div class="cookie" id="js-cookies" style="display: none;"><p>Используя сайт IsDesign, вы соглашаетесь с использованием файлов cookie и сервисов сбора технических данных для улучшения качества обслуживания. <a href="privacy-policy.html">Подробнее</a></p> <button class="btn">Хорошо</button></div>');
			$('#js-cookies').stop().delay(1000).fadeIn(700);
			$('#js-cookies>button').click(function() {
				setCookie('cookie_notice', 1);
				$('#js-cookies').stop().fadeOut(700, function() {
					$('#js-cookies').remove();
				});
			});
		}

	})
})(jQuery)
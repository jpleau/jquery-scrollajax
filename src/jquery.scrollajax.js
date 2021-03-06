/*
 *  Plugin:  jquery-scrollajax
 *  Version: %VERSION%
 *  Author: Jason Pleau <jason@jpleau.ca>
 *  License: MIT - Copyright (c) 2015 Jason Pleau <jason@jpleau.ca>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

;(function($, window, document, undefined) {
	var pluginName = 'scrollajax';
	var version = "%VERSION%";

	var defaults = {
		url: '',
		method: 'get',
		success: function() {

		},
		data: function() {
			return {
				page: this._vars.page_number
			};
		},
		scroll: function() {
			this._vars.page_number += 1;
		},
		init: function() {
			if ($(this.element).attr('data-scrollajaxpage')) {
				this._vars.page_number = parseInt($(this.element).data('scrollajaxpage'));
			}
		},
		history: function() {
			return {
				page: this._vars.page_number
			};
		}
	};

	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._vars = {
			page_number: 1
		};
		this._defaults = defaults;
		this._name = pluginName;
		this._version_object = version;
		this._version = version.major + "." + version.minor + "." + version.patch;
		this.init();
	}

	Plugin.prototype = {
		init: function() {
			var $this = this;

			$(document).ready(function() {
				if (typeof $this.options.init === 'function') {
					$this.options.init.call($this);
				}
			});

			$(window).on("scroll", function(event) {
				var load = false;
				if($(window).scrollTop() + $(window).height() == $(document).height()) {
					load = true;
				}
				if (!load) {
					return;
				}

				if (typeof $this.options.scroll === 'function') {
					$this.options.scroll.call($this, event)
				}

				data = {}
				if (typeof $this.options.data === 'function') {
				data = $this.options.data.call($this);
				}

				if (typeof $this.options.history === 'function') {
					serializedData = "?" + $.param($this.options.history.call($this));
					history.pushState('', '', serializedData);
				}

				data.scroll = true;
				var r = new Date().getTime();
				data.r = r;

				$.ajax({
					url: $this.options.url,
					data: data,
					type: $this.options.method,
					success: function(result) {
						$($this.element).append(result);
						if (typeof $this.options.success === 'function') {
							$this.options.success.call($this, result);
						}
					}
				});


			});

		},

		version: function() {
			return this._version;
		},

		get_page_number: function() {
			return this._vars.page_number;
		},

		set_page_number: function(page_number) {
			if (page_number === parseInt(page_number, 10) && page_number > 0) {
				this._vars.page_number = page_number;
			}
		}
	}
	
	$.fn[pluginName] = function (options) {
		var args = arguments;
		if (options === undefined || typeof options === 'object') {
			return this.each(function () {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
				}
			});
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
			var returns;
			this.each(function () {
				var instance = $.data(this, 'plugin_' + pluginName);
				if (instance instanceof Plugin && typeof instance[options] === 'function') {
					returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
				}
				if (options === 'destroy') {
					$.data(this, 'plugin_' + pluginName, null);
				}
			});
			return returns !== undefined ? returns : this;
		}
	};
})(jQuery, window, document);

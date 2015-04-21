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
		ajax_url: '',
		ajax_method: '',
		ajax_success_cb: null,
		data_cb : function() {
			return {};
		},
		scroll_cb: null,
		init_cb: null,
		history_cb: false
	};

	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this._version_object = version;
		this._version = version.major + "." + version.minor + "." + version.patch;
		this.init();
	}

	Plugin.prototype = {
		init: function() {
			var $this = this;

			$(window).on("scroll", function(event) {
				var load = false;
				if($(window).scrollTop() + $(window).height() == $(document).height()) {
					load = true;
				}
				if (!load) {
					return;
				}

				if (typeof $this.options.scroll_cb === 'function') {
					$this.options.scroll_cb.call(event)
				}

				data = {}
				if (typeof $this.options.data_cb === 'function') {
					data = $this.options.data_cb.call();
				}

				if (typeof $this.options.history_cb === 'function') {
					if (typeof $this.options.history_cb === 'function') {
						serializedData = "?" + $.param($this.options.history_cb.call());
					}

					history.pushState('', '', serializedData);
				}

				data.scroll = true;
				var r = new Date().getTime();
				data.r = r;

				$.ajax({
					url: $this.options.ajax_url,
					data: data,
					type: $this.options.ajax_method,
					success: function(result) {
						$($this.element).append(result);
						if (typeof $this.options.ajax_success_cb === 'function') {
							$this.options.ajax_success_cb.call(result);
						}
					}
				});


			});

		},

		version: function() {
			return this._version;
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

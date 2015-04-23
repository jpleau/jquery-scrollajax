Example
=

```javascript
$(function() {
	var noPage = 1;
	$("#content").scrollajax({
		ajax_url: '/scroll/',
		ajax_method: 'get',
		init_cb: function() {
			if ($("#content").attr('data-scrollajaxpage')) {
				noPage = parseInt($("#content").data('scrollajaxpage'));
			}
		},
		scroll_cb: function(event) {
			noPage += 1;
		},
		history_cb: function() {
			return {
				page: noPage
			};
		},
		data_cb: function() {
			return {
				page: noPage
			};
		}

	});
});
```

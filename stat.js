jQuery(document).ready(function($) {
	$("ul.urls li.normal").hover(
	function() {
		var url = $(this).find('.url a').attr('href').replace('/stats','');
		$(this).children('.social').show();
		$(this).find('.facebook').on('click', function() {
			popup('https://www.facebook.com/sharer.php?u=' + escape(url), 680, 380);
		});
		$(this).find('.twitter').on('click', function() {
			popup('https://twitter.com/?status=' + escape(url), 680, 380);
		});
		$(this).find('.googleplus').on('click', function() {
			popup('https://plus.google.com/share?url=' + escape(url), 680, 520);
		});
	}, function() {
		$(this).children('.social').hide();
	});

	function popup(url, width, height) {
		var left = (screen.width - width) / 2;
		var top = (screen.height - height) / 2;
		var params = 'width=' + width + ', height=' + height;
		params += ', top=' + top + ', left=' + left;
		params += ', directories=no';
		params += ', location=no';
		params += ', menubar=no';
		params += ', resizable=no';
		params += ', scrollbars=no';
		params += ', status=no';
		params += ', toolbar=no';
		newwin = window.open(url, 'share_window', params);
		if (window.focus) {
			newwin.focus()
		}
		return false;
	}
});

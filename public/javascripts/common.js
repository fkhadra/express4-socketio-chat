
$(document).ready(function () {

	$('#avatar').imagepicker({
		"selected": getAvatar
	});
	function getAvatar (){
		var img = "";
		$(this).data('picker').sync_picker_with_select();
		console.log(img);
		//$('.selected > img').attr('src');

	}

});
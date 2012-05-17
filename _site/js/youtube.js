$(document).ready(function(){ 
	if (!jQuery.browser.mobile) {
		$('.mobile').remove();
		$('#player').youTubeEmbed("http://www.youtube.com/watch?v=Gui48cja7g0");
	}
	 if(jQuery.browser.mobile) {	
		$('.flashContainer').remove();
	}
});
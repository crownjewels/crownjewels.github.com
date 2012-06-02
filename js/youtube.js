$(document).ready(function(){ 
	if (!jQuery.browser.mobile) {
		$('.mobile').remove();
		$('#player').youTubeEmbed("http://www.youtube.com/watch?v=NomMKITKUI4");
	}
	 if(jQuery.browser.mobile) {	
		$('.flashContainer').remove();
	}
});


(function($){
(function(a){jQuery.browser.mobile=/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);	
	$.fn.youTubeEmbed = function(settings){
		
		// Settings can be either a URL string,
		// or an object
		
		if(typeof settings == 'string'){
			settings = {'video' : settings}
		}
		
		// Default values
		
		var def = {
			width		: 640,
			progressBar	: true
		};
		
		settings = $.extend(def,settings);
		
		var elements = {
			originalDIV	: this,	// The "this" of the plugin
			container	: null,	// A container div, inserted by the plugin
			control		: null,	// The control play/pause button
			player		: null,	// The flash player
			progress	: null,	// Progress bar
			elapsed		: null	// The light blue elapsed bar
		};


		try{	

			settings.videoID = settings.video.match(/v=(.{11})/)[1];
			
			// The safeID is a stripped version of the
			// videoID, ready for use as a function name

			settings.safeID = settings.videoID.replace(/[^a-z0-9]/ig,'');
		
		} catch (e){
			// If the url was invalid, just return the "this"
			return elements.originalDIV;
		}

		// Fetch data about the video from YouTube's API

		var youtubeAPI = 'http://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc';

		$.get(youtubeAPI,{'q':settings.videoID},function(response){
			
			var data = response.data;
	
			if(!data.totalItems || data.items[0].accessControl.embed!="allowed"){
				
				// If the video was not found, or embedding is not allowed;
				
				return elements.originalDIV;
			}

			// data holds API info about the video:
			
			data = data.items[0];
			
			settings.ratio = 3/4;
			if(data.aspectRatio == "widescreen"){
				settings.ratio = 9/16;
			}
			
			settings.height = Math.round(settings.width*settings.ratio);

			// Creating a container inside the original div, which will
			// hold the object/embed code of the video

			elements.container = $('<div>',{class:'flashContainer',css:{
				width	: settings.width,
				height	: settings.height
			}}).appendTo(elements.originalDIV);

			// Embedding the YouTube chromeless player
			// and loading the video inside it:

			elements.container.flash({
				swf			: 'http://www.youtube.com/apiplayer?enablejsapi=1&version=3',
				id			: 'video_'+settings.safeID,
				height		: settings.height,
				width		: settings.width,
				allowScriptAccess:'always',
				wmode		: 'transparent',
				flashvars	: {
					"video_id"		: settings.videoID,
					"playerapiid"	: settings.safeID
				}
			});

			// We use get, because we need the DOM element
			// itself, and not a jquery object:
			
			elements.player = elements.container.flash().get(0);

			// Creating the control Div. It will act as a ply/pause button

			elements.control = $('<div>',{class:'controlDiv play'})
							   .appendTo(elements.container);

			// If the user wants to show the progress bar:

			if(settings.progressBar){
				elements.progress =	$('<div>',{class:'progressBar'})
									.appendTo(elements.container);

				elements.elapsed =	$('<div>',{class:'elapsed'})
									.appendTo(elements.progress);
				
				elements.progress.click(function(e){
					
					// When a click occurs on the progress bar, seek to the
					// appropriate moment of the video.
					
					var ratio = (e.pageX-elements.progress.offset().left)/elements.progress.outerWidth();
					
					elements.elapsed.width(ratio*100+'%');
					elements.player.seekTo(Math.round(data.duration*ratio), true);
					return false;
				});

			}

			var initialized = false;

			
			// Creating a global event listening function for the video
			// (required by YouTube's player API):
			
			window['eventListener_'+settings.safeID] = function(status){

				var interval;
				
				if(status==-1)	// video is loaded
				{
					if(!initialized)
					{
						// Listen for a click on the control button:
						
						elements.control.click(function(){
							if(!elements.container.hasClass('playing')){
								
								// If the video is not currently playing, start it:

								elements.control.removeClass('play replay').addClass('pause');
								elements.container.addClass('playing');
								elements.player.playVideo();
								
								if(settings.progressBar){
									interval = window.setInterval(function(){
										elements.elapsed.width(
											((elements.player.getCurrentTime()/data.duration)*100)+'%'
										);
									},1000);
								}
								
							} else {
								
								// If the video is currently playing, pause it:
								
								elements.control.removeClass('pause').addClass('play');
								elements.container.removeClass('playing');
								elements.player.pauseVideo();
								
								if(settings.progressBar){
									window.clearInterval(interval);
								}
							}
						});
						
						initialized = true;
					}
					
					else{
						// This will happen if the user has clicked on the
						// YouTube logo and has been redirected to youtube.com

						if(elements.container.hasClass('playing'))
						{
							
							elements.control.click();
						}

					}
				}
				
				if(status==0){ // video has ended
					elements.control.removeClass('pause').addClass('replay');
					elements.container.removeClass('playing');
				}
			}
			
			// This global function is called when the player is loaded.
			// It is shared by all the videos on the page:
			if (jQuery.browser.mobile) 
			{
				elements.control.click();
			}
			
			if(!window.onYouTubePlayerReady)
			{				
				window.onYouTubePlayerReady = function(playerID){
					document.getElementById('video_'+playerID).addEventListener('onStateChange','eventListener_'+playerID);
				}
			}
		},'jsonp');
		return elements.originalDIV;
	}

})(jQuery);
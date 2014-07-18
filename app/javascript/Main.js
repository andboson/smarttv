var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();

var Main =
{

};

Main.onLoad = function()
{
	// Enable key event processing
	this.enableKeys();
	widgetAPI.sendReadyEvent();
    var playList = plist();
    alert(playList.rawlist);
    playList.setContent();
};

Main.onUnload = function()
{

};

Main.enableKeys = function()
{
	document.getElementById("anchor").focus();
};

Main.keyDown = function()
{
    var mover = scollList();
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	switch(keyCode)
	{
		case tvKey.KEY_RETURN:
		case tvKey.KEY_PANEL_RETURN:
			alert("RETURN");
			widgetAPI.sendReturnEvent();
			break;
		case tvKey.KEY_LEFT:
			alert("LEFT");
			break;
		case tvKey.KEY_RIGHT:
			alert("RIGHT");
			break;
		case tvKey.KEY_UP:
			alert("UP");
            mover.up();
			break;
		case tvKey.KEY_DOWN:
			alert("DOWN");
            mover.down();
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");
            Player.init();
            Player.deinit();
            Player.stopVideo();
            Player.init();
            var url = $('.canalline.selected').find('a').attr('href');
            Player.setVideoURL(url);
            Player.playVideo();
			break;
		default:
			alert("Unhandled key");
			break;
	}
};

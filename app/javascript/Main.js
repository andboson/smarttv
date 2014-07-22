var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();

var Main =
{
    selectedVideo : 0,
    mode : 0,
    mute : 0,

    UP : 0,
    DOWN : 1,

    WINDOW : 0,
    FULLSCREEN : 1,

    NMUTE : 0,
    YMUTE : 1
}

Main.onLoad = function()
{
    alert("onload");

    if ( Player.init())
    {
        Player.stopCallback = function()
        {
            /* Return to windowed mode when video is stopped
             (by choice or when it reaches the end) */
            Main.setWindowMode();
        }

        var menu = new MainMenu();
        this.playlist = menu.list;
        // Enable key event processing
        this.enableKeys();

        widgetAPI.sendReadyEvent();
    }
    else
    {
        alert("Failed to initialise");
    }
}

Main.onUnload = function()
{
    Player.deinit();
}

Main.updateCurrentVideo = function(move)
{
    Player.setVideoURL( Data.getVideoURL(this.selectedVideo) );
}

Main.enableKeys = function()
{
    document.getElementById("anchor").focus();
}

Main.keyDown = function()
{

    var keyCode = event.keyCode;
    alert("Key pressed: " + keyCode);

    switch(keyCode)
    {
        case tvKey.KEY_RED:
            sf.service.setScreenSaver(true);
            break;
        case tvKey.KEY_GREEN:
            sf.service.setScreenSaver(true, 100);
            break;
        case tvKey.KEY_YELLOW:
            sf.service.AVSetting.show(function asd(){
                Main.enableKeys();
            });

            break;
        case tvKey.KEY_BLUE:
            sf.service.AVSetting.hide();
            break;
        case tvKey.KEY_RETURN:
        case tvKey.KEY_PANEL_RETURN:
            alert("RETURN");
            Player.stopVideo();
            widgetAPI.sendReturnEvent();
            break;
            break;

        case tvKey.KEY_PLAY:
            alert("PLAY");

            this.handlePlayKey();
            break;

        case tvKey.KEY_STOP:
            alert("STOP");
            Player.stopVideo();
            break;

        case tvKey.KEY_PAUSE:
            alert("PAUSE");
            this.handlePauseKey();
            break;

        case tvKey.KEY_FF:
            alert("FF");
            if(Player.getState() != Player.PAUSED)
                Player.skipForwardVideo();
            break;

        case tvKey.KEY_RW:
            alert("RW");
            if(Player.getState() != Player.PAUSED)
                Player.skipBackwardVideo();
            break;

        case tvKey.KEY_RIGHT:
            alert("DOWN");
            this.selectNextVideo(this.DOWN);
            break;

        case tvKey.KEY_LEFT:
            alert("UP");
            this.selectPreviousVideo(this.UP);
            break;

        case tvKey.KEY_UP:
            alert("UP");
            this.playlist.up();
            break;

        case tvKey.KEY_DOWN:
            alert("down");
            this.playlist.down();
            break;

        case tvKey.KEY_ENTER:
        case tvKey.KEY_PANEL_ENTER:
            alert("ENTER");

            this.handlePlayKey();
            break;

        case tvKey.KEY_MUTE:
            alert("MUTE");
            this.muteMode();
            break;

        default:
            alert("Unhandled key");
            break;
    }
}

Main.handlePlayKey = function()
{
    var url = $('.canalline.selected').find('a').attr('href');
    var name = $('.canalline.selected').find('a').html();

    if( isFinite(url)){
        $('#cat-list-back').html('');
        var parent = $('#container');
        var m3uObj = new m3u();
        var canals = m3uObj.filterCanals(url);
        this.playlist = new PlayList(canals, parent);
    } else {
    switch ( Player.getState() )
    {
        case Player.STOPPED:
            Player.setFullscreen();
            Player.setVideo(url, name);
            Player.playVideo();
            break;

        case Player.PAUSED:
            Player.resumeVideo();
            break;

        case Player.PLAYING:
            Player.stopVideo();
            Player.setWindow();

        default:
            alert("Ignoring play key, not in correct state");
            break;
    }
    }
}

Main.handlePauseKey = function()
{
    switch ( Player.getState() )
    {
        case Player.PLAYING:
            Player.pauseVideo();
            break;

        default:
            alert("Ignoring pause key, not in correct state");
            break;
    }
}

Main.selectNextVideo = function(down)
{
    Player.stopVideo();

    this.selectedVideo = (this.selectedVideo + 1) % Data.getVideoCount();

    this.updateCurrentVideo(down);
}

Main.selectPreviousVideo = function(up)
{
    Player.stopVideo();

    if (--this.selectedVideo < 0)
    {
        this.selectedVideo += Data.getVideoCount();
    }

    this.updateCurrentVideo(up);
}

Main.setFullScreenMode = function()
{
    if (this.mode != this.FULLSCREEN)
    {

        Player.setFullscreen();

        this.mode = this.FULLSCREEN;
    }
}

Main.setWindowMode = function()
{
    if (this.mode != this.WINDOW)
    {
        Player.setWindow();

        this.mode = this.WINDOW;
    }
}

Main.toggleMode = function()
{
    if(Player.getState() == Player.PAUSED)
    {
        Player.resumeVideo();
    }
    switch (this.mode)
    {
        case this.WINDOW:
            this.setFullScreenMode();
            break;

        case this.FULLSCREEN:
            this.setWindowMode();
            break;

        default:
            alert("ERROR: unexpected mode in toggleMode");
            break;
    }
}
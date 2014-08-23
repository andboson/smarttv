var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var audiocontrol = deviceapis.audiocontrol;
var epg = new Epg();
var playLast = new PlayLast();
var audio = null;
var TVPlugin1 = false;

var nav = {};
var Main =
{
    focusedEpg: 0,
    m3uObj: null,
    screen: 0,
    selectedVideo: 0,
    mode: 0,
    mute: 0,

    UP: 0,
    DOWN: 1,

    WINDOW: 0,
    FULLSCREEN: 1,

    NMUTE: 0,
    YMUTE: 1
}

Main.onLoad = function () {
    alert("onload");

    Display.init();
    if (Player.init()) {
        this.showMainScreen();
        audio = new Audio();
        // Enable key event processing
        this.enableKeys();
        dateLabel();
        window.setInterval(dateLabel, 300);
        window.setInterval(timeLabel, 300);
        widgetAPI.sendReadyEvent();
        playLast.check(this);
        Player.setWindow();
    }
    else {
        alert("Failed to initialise");
    }
}


Main.onUnload = function () {
    Player.deinit();
}

Main.updateCurrentVideo = function (move) {
    Player.setVideoURL(Data.getVideoURL(this.selectedVideo));
}

Main.enableKeys = function () {
    document.getElementById("anchor").focus();
}


Main.keyDown = function () {

    var keyCode = event.keyCode;
    alert("Key pressed: " + keyCode);

    switch (keyCode) {
        case tvKey.KEY_RED:
            sf.service.setScreenSaver(true);
            break;
        case tvKey.KEY_GREEN:
            sf.service.setScreenSaver(true, 100);
            break;
        case tvKey.KEY_YELLOW:
            sf.service.AVSetting.show(function asd() {
                Main.enableKeys();
            });

            break;
        case tvKey.KEY_BLUE:
            sf.service.AVSetting.hide();
            break;
        case tvKey.KEY_RETURN:
        case tvKey.KEY_EXIT:
        case tvKey.KEY_PANEL_RETURN:
            alert("RETURN");
            $('#epg').removeClass('epg-selected');
            Main.focusedEpg = 0;
            Display.hide();
            sf.key.preventDefault();
            this.handleExit();
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
            if (Player.getState() != Player.PAUSED)
                Player.skipForwardVideo();
            break;

        case tvKey.KEY_RW:
            alert("RW");
            if (Player.getState() != Player.PAUSED)
                Player.skipBackwardVideo();
            break;

        case tvKey.KEY_RIGHT:
            alert("DOWN");
            if (Main.focusedEpg != 1 && Main.screen == 1) {
                $('#epg').addClass('epg-selected');
                Main.focusedEpg = 1;
            } else if (Player.state == Player.PLAYING) {
                audio.volUp();
            }
            break;

        case tvKey.KEY_LEFT:
            if (Main.focusedEpg == 1) {
                $('#epg').removeClass('epg-selected');
                Main.focusedEpg = 0;
                return;
            }

            if (Player.state == Player.PLAYING) {
                audio.volDown();
                return;
            }
            alert("UP");
            this.showMainScreen();
            break;

        case tvKey.KEY_UP:
        case tvKey.KEY_CH_UP:
            if (Main.focusedEpg == 1) {
                $('#epg').scrollTop($('#epg').scrollTop() - 100);
                return;
            }
            alert("UP");
            this.playlist.up();
            if(Player.getState() == Player.PLAYING){
                this.changeVideo();
            }
            break;

        case tvKey.KEY_DOWN:
        case tvKey.KEY_CH_DOWN:
            if (Main.focusedEpg == 1) {
                $('#epg').scrollTop($('#epg').scrollTop() + 100);
                return;
            }
            alert("down");
            this.playlist.down();
            if(Player.getState() == Player.PLAYING){
                this.changeVideo();
            }
            break;

        case tvKey.KEY_ENTER:
        case tvKey.KEY_PANEL_ENTER:
            alert("ENTER");
            this.handlePlayKey();
            break;

        case tvKey.KEY_VOL_DOWN:
        case tvKey.KEY_PANEL_VOL_DOWN:
            audio.volDown();
            break;

        case tvKey.KEY_VOL_UP:
        case tvKey.KEY_PANEL_VOL_UP:
            audio.volUp();
            break;

        case tvKey.KEY_MUTE:
            audio.toggleMute();
            break;

        default:
            alert("Unhandled key");
            break;
    }
}

Main.showMainScreen = function () {
    var menu = new MainMenu();
    this.playlist = menu.list(function (cb) {
        $('#splash').hide();
        $('#main-screen').show();
        $('#container').html('');
        menu.pickSelected(cb);
    });

    this.playlist.callback = null;
    this.screen = 0;
}

Main.showPlaylist = function (catId) {
    if (this.m3uObj == null) {
        this.m3uObj = new M3u(null);
    }

    MainMenu.selectedCaption = $('.canalline.selected').find('a').html();
    $('#cat-list-back').html('');
    $('#main-screen').hide();
    var parent = $('#container');
    var canals = this.m3uObj.filterCanals(catId);
    this.playlist = new PlayList(canals, parent, null);
    this.screen = 1;
    $('#play-screen .header p span').html(MainMenu.selectedCaption);
    timeLabel();
    epg.getDProgram();
};

Main.handlePlayKey = function () {
    var url = $('.canalline.selected').find('a').attr('href');
    var name = $('.canalline.selected').find('a').html();

    if (this.screen == 0) {
        MainMenu.selected = url;
        playLast.remember(url);
        this.showPlaylist(url);
    } else if (this.screen == 1) {
        switch (Player.getState()) {
            case Player.STOPPED:
                Player.setFullscreen();
                playLast.remember('', '', $('.canalline.selected').index());
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
};

Main.handlePauseKey = function () {
    switch (Player.getState()) {
        case Player.PLAYING:
            Player.pauseVideo();
            break;

        default:
            alert("Ignoring pause key, not in correct state");
            break;
    }
}

Main.setFullScreenMode = function () {
    if (this.mode != this.FULLSCREEN) {

        Player.setFullscreen();

        this.mode = this.FULLSCREEN;
    }
}

Main.setWindowMode = function () {
    if (this.mode != this.WINDOW) {
        Player.setWindow();

        this.mode = this.WINDOW;
    }
}

Main.toggleMode = function () {
    if (Player.getState() == Player.PAUSED) {
        Player.resumeVideo();
    }
    switch (this.mode) {
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

Main.changeVideo = function(){
    var url = $('.canalline.selected').find('a').attr('href');
    var name = $('.canalline.selected').find('a').html();
    alert('changing video ' + url);
    Player.setVideo(url, name);
    Player.playVideo();
}

Main.handleExit = function () {
    if (Player.state == Player.PLAYING) {
        Player.stopVideo();
        return;
    }
    if (this.screen == 1 && Player.state != Player.PLAYING) {
        this.showMainScreen();
        Player.stopVideo();
    } else if (this.screen == 0) {
        playLast.forget();
        var pop = $('#popup');
        pop.sfPopup({
            text: 'Закрыть приложение?',
            buttons: ['Да', 'Нет'],
            timeout: 0,
            defaultFocus: 1,    // index of default focused button. this indicates array index of 'buttons' option (zero-based)
            callback: function (selectedIndex) {
                if (selectedIndex == 0) {
                    Main = null;
                    widgetAPI.sendReturnEvent();
                    return;
                }
                Main.enableKeys();
            }
        });
        pop.sfPopup('show');
        $('#popup').css('z-index', '10000');
    }
}
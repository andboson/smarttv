var Player =
{
    plugin: null,
    state: -1,
    skipState: -1,
    stopCallback: null, /* Callback function to be set by client */
    originalSource: null,

    STOPPED: 0,
    PLAYING: 1,
    PAUSED: 2,
    FORWARD: 3,
    REWIND: 4
}

Player.init = function () {
    var success = true;
    alert("success vale :  " + success);
    this.state = this.STOPPED;
    var cookie = function () {
        var result = [];
        document.cookie.split('; ').forEach(function (e) {
            var item = e.split('=');
            result[item[0]] = item[1];
            console.log(item)
        });
        return result;
    }();

    this.rememberedUrl = cookie.lastUrl;

    sf.service.VideoPlayer.init({
        onstatechange: function (state) {
            alert('Current State : ' + state);
        },
        onend: function () {
            alert('Video ended.');
        },
        onerror: function (error) {
            alert('Error : ' + error);
        }
    });

    this.setWindow();
    alert("success vale :  " + success);
    return success;
};

Player.deinit = function () {

};

Player.setWindow = function () {
    sf.service.VideoPlayer.hide();
};

Player.setFullscreen = function () {
    sf.service.VideoPlayer.show();
    // sf.service.VideoPlayer.setFullScreen(true);
    sf.service.VideoPlayer.setPosition({
        left: 0,
        top: 0,
        width: 1280,
        height: 720
    });
}

Player.setVideo = function (url, name) {
    this.url = url;
    this.name = name;
    alert("URL = " + this.url);
};

Player.playVideo = function () {
    if (this.url == null) {
        alert("No videos to play");
    }
    else {
        this.state = this.PLAYING;
        sf.service.setVolumeControl(true);
        sf.service.VideoPlayer.play({
            url: this.url,
            title: this.name,
            fullScreen: true
        });

        sf.service.VideoPlayer.setKeyHandler(sf.key.STOP, function () {
            Player.stopVideo();
        });

        sf.service.VideoPlayer.setKeyHandler(sf.key.RETURN, function () {
            sf.key.preventDefault();
            Player.stopVideo();
        });
    }
};

Player.pauseVideo = function () {
    this.state = this.PAUSED;
    sf.service.VideoPlayer.pause();
}

Player.stopVideo = function () {
    if (this.state != this.STOPPED) {
        this.state = this.STOPPED;
        // sf.service.VideoPlayer.setFullScreen(false);
        sf.service.VideoPlayer.stop();
        // sf.service.VideoPlayer.hide();
        Main.enableKeys();
        widgetAPI.sendReadyEvent();

        if (this.stopCallback) {
            this.stopCallback();
        }
    }
    else {
        alert("Ignoring stop request, not in correct state");
    }
}

Player.resumeVideo = function () {
    this.state = this.PLAYING;
    sf.service.VideoPlayer.resume();
}


Player.getState = function () {
    return this.state;
}


stopPlayer = function () {
    Player.stopVideo();
}
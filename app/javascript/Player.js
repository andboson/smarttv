var Player =
{
    plugin : null,
    state : -1,
    skipState : -1,
    stopCallback : null,    /* Callback function to be set by client */
    originalSource : null,
    
    STOPPED : 0,
    PLAYING : 1,
    PAUSED : 2,  
    FORWARD : 3,
    REWIND : 4,
    track: 0
}

Player.langs = {
    6514793: 'Китайская',
    6647399: 'Английская',
    6713957: 'Француская',
    6776178: 'Немецкая',
    6911073: 'Итальянская',
    6975598: 'Японская',
    7040882: 'Корейская',
    7368562: 'Португальская',
    7501171: 'Русская',
    7565409: 'Испанская',
    8026747: 'Украинская'
};

Player.langsKey = {
    "RUS" : 7501171
}

Player.init = function()
{
    var success = true;
    alert("success vale :  " + success);
    this.state = this.STOPPED;
    this.plugin = document.getElementById("pluginPlayer");
    this.plugin.Open("Player","1.112","Player");
    this.plugin.OnEvent= "OnEvent";
    pluginWindow = document.getElementById("pluginObjectTVMW");
    this.setWindow();
    alert("success vale :  " + success);       
    return success;
}

function OnEvent(event,data1, data2){
	switch (event) {
	 
	  case 14:// OnCurrentPlayBackTime, param = playback time in ms
		  Player.setCurTime(data1);
	   break;
	 
	  case 1:  // OnConnectionFailed
	   alert('Error: Connection failed');   
	   break;
	   
	  case 2:  // OnAuthenticationFailed
	   alert('Error: Authentication failed');   
	   break;
	   
	  case 3:  // OnStreamNotFound
          Display.status('Канал не найден');
	   break;
	   
	  case 4:  // OnNetworkDisconnected
	   Display.status('Нет соединения');
	   break;
	   
	  case 6:  // OnRenderError
	   var error;
	   switch (data1) {
	    case 1:
	     error = 'Unsupported container';
	     break;
	    case 2:
	     error = 'Unsupported video codec';
	     break;
	    case 3:
	     error = 'Unsupported audio codec';
	     break;
	    case 6:
	     error = 'Corrupted stream';
	     break;
	    default:
	     error = 'Unknown';
	   }
          Display.status('Ошибка воспроизведения ' + error);
	   break;
	   
	  case 8:  // OnRenderingComplete
	   alert('End of streaming');   
	   break;
	   
	  case 9:  // OnStreamInfoReady
	   alert('updateStatus');
	   Player.setRusLang(data1);
	   break; 
	   
	  case 11: // OnBufferingStart
	   alert('Buffering started');
       Display.status('Буферизация');
	   break;
	   
	  case 12: // OnBufferingComplete
	   alert('Buffering complete');
	   Display.hide();
	   break;
	   
	  case 13: // OnBufferingProgress, param = progress in % 
	   alert('Buffering: ');
       Display.status('Буферизация... ' + data1 + '%');
	   break;
	 }
	
}

Player.deinit = function()
{
      alert("Player deinit !!! " );       
      
      if (this.plugin)
      {
            this.plugin.Stop();
      }
    //  this.plugin.Close();
}

Player.setWindow = function()
{
   // $('#pluginPlayer').hide();
}

Player.setFullscreen = function()
{
    $('#pluginPlayer').show();
    this.plugin.Execute('SetDisplayArea', 9, 9, 400, 400);
}

Player.setVideo = function(url)
{
    this.url = url;
    alert("URL = " + this.url);
}

Player.playVideo = function()
{
    if (this.url == null)
    {
        alert("No videos to play");
    }
    else
    {
        Display.status('Буферизация...');
        $('#play-screen').hide();
        this.state = this.PLAYING;
        this.plugin.Execute('Stop');
        this.plugin.Execute('InitPlayer', this.url);
        this.plugin.Execute('SetDisplayArea', 0, 0, 1280, 720);
        this.plugin.Execute("SetInitialBufferSize", 1 * 1024 * 1024);
        this.plugin.Execute("SetPendingBuffer", 1.5 * 1024 * 1024);
        this.plugin.Execute('StartPlayback');
        alert('ply');
    }
}

Player.pauseVideo = function()
{
    this.plugin.Execute("Pause");
}

Player.stopVideo = function()
{
    $('#play-screen').show();
    if (this.state != this.STOPPED)
    {
        this.state = this.STOPPED;

        //this.plugin.Stop();

        this.plugin.Execute('Stop');
        if (this.stopCallback)
        {
            this.stopCallback();
        }
    }
    else
    {
        alert("Ignoring stop request, not in correct state");
    }
}

Player.resumeVideo = function()
{
    this.state = this.PLAYING;

    this.plugin.Resume();
}

Player.skipForwardVideo = function()
{

}

Player.skipBackwardVideo = function()
{

}

Player.getState = function()
{
    return this.state;
}



Player.setCurTime = function(time)
{
}

Player.setTotalTime = function()
{
}

Player.setRusLang = function(code){
    var countAudio = 2;//this.plugin.Execute('GetTotalNumOfStreamID', 1);
    for (var i = 0; i < countAudio; i++) {
        var lang = this.plugin.Execute('GetStreamLanguageInfo', 1, i);
        if( lang == Player.langsKey.RUS){
            this.plugin.Execute('SetStreamID', 1, i);
            Player.track = i;
            alert('set lang for stream #:' + i);
        }

    }
}

Player.setNextLang = function(){
    var countAudio = 2; //this.plugin.Execute('GetTotalNumOfStreamID', 1);
    for (var i = 0; i < countAudio; i++) {
        if( i == Player.track){
            var nextLang = (i+ 1) < countAudio ? i+ 1 : 0;
            var lang = this.plugin.Execute('GetStreamLanguageInfo', 1, nextLang);
            var langString = Player.langs[lang];
            Display.status(langString + ' дорожка');
            alert(langString);
            this.plugin.Execute('SetStreamID', 1, nextLang);
            Player.track = nextLang;
            window.setTimeout(function(){
                Display.hide();
            }, 200)
            break;
        }
    }
}

stopPlayer = function()
{
    Player.stopVideo();
}


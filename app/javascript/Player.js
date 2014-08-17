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
    REWIND : 4
}

Player.init = function()
{
    var success = true;
    alert("success vale :  " + success);    
    this.state = this.STOPPED;
    this.plugin = document.getElementById("pluginPlayer");
    //this.plugin.OnEvent=OnEvent;
    this.plugin.OnStreamInfoReady = 'Player.setTotalTime';
    this.plugin.OnBufferingStart = 'Player.onBufferingStart';
    this.plugin.OnBufferingProgress = 'Player.onBufferingProgress';
    this.plugin.OnBufferingComplete = 'Player.onBufferingComplete';
    pluginWindow = document.getElementById("pluginObjectTVMW");
    this.setWindow();
    alert("success vale :  " + success);       
    return success;
}

function OnEvent(event,data1){
    alert('event  ' + event);
    alert('data1  ' + data1);
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
	   alert('Error: Stream not found');   
	   break;
	   
	  case 4:  // OnNetworkDisconnected
	   alert('Error: Network disconnected');   
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
	   alert('Error: ' + error);   
	   break;
	   
	  case 8:  // OnRenderingComplete
	   alert('End of streaming');   
	   break;
	   
	  case 9:  // OnStreamInfoReady
	   alert('updateStatus');
	   Player.setTotalTime(data1);
	   break; 
	   
	  case 11: // OnBufferingStart
	   alert('Buffering started');
	   Player.onBufferingStart();
	   break;
	   
	  case 12: // OnBufferingComplete
	   alert('Buffering complete');
	   Player.onBufferingComplete();
	   break;
	   
	  case 13: // OnBufferingProgress, param = progress in % 
	   alert('Buffering: ');
	   Player.onBufferingProgress(data1);
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
    $('#pluginPlayer').hide();
}

Player.setFullscreen = function()
{
    $('#pluginPlayer').show();
    this.plugin.SetDisplayArea(0, 0, 1280, 720);
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
        this.plugin.Stop();
        $('#play-screen').hide();
        this.state = this.PLAYING;
        this.setFullscreen();
        this.plugin.Play(this.url );
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

        this.plugin.Stop();

        
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

// Global functions called directly by the player 

Player.onBufferingStart = function()
{
    Display.status("Буферизация");
}

Player.onBufferingProgress = function(percent)
{
    Display.hide();
}

Player.onBufferingComplete = function()
{
    Display.status("Нет связи с сервером!");
}

Player.setCurTime = function(time)
{
}

Player.setTotalTime = function()
{
}

onServerError = function()
{
    Display.status("Нет связи с сервером!");
}

OnNetworkDisconnected = function()
{
    Display.status("Ошибка сети!");
}

getBandwidth = function(bandwidth) { alert("getBandwidth " + bandwidth); }

onDecoderReady = function() { alert("onDecoderReady"); }

onRenderError = function() {
    alert("onRenderError");
    Display.status("Не могу воспроизвести!");
}

stopPlayer = function()
{
    Player.stopVideo();
}

setTottalBuffer = function(buffer) { alert("setTottalBuffer " + buffer); }

setCurBuffer = function(buffer) { alert("setCurBuffer " + buffer); }

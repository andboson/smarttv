var Audio = function () {

    var control = $('#soundcontrol');
    var volumeLine = $('#soundcontrol .stripes-vol');
    var volumePercent = $('#soundcontrol .percent');
    var coeff = 250 / 100;
    var timer = null;
    var volTimer = null;

    this.muted = false;

    this.volUp = function () {
        try{
            audiocontrol.setMute(false);
            audiocontrol.setVolumeUp();
        } catch (e){
                    //
        }
        this.show();
    }

    this.volDown = function () {
        try{
            audiocontrol.setMute(false);
            audiocontrol.setVolumeDown();
        } catch (e){
            //
        }
        this.show();
    }

    this.show = function(){
        var currVolume = !this.muted ? audiocontrol.getVolume() : 0;
        volumeLine.css('width', (coeff * currVolume) + 'px');
        volumePercent.html(currVolume);
        control.show();
        clearTimeout(timer);
        timer = window.setTimeout(function(){ control.hide(); }, 2000);
    }

    this.volFree = function(){
        clearInterval(volTimer);
    }

    this.toggleMute = function(){
        this.muted = this.muted ? false : true;

        if(this.muted){
            volumeLine.css('width', (0) + 'px');
        } else {
            var currVolume = audiocontrol.getVolume();
            volumeLine.css('width', (coeff * currVolume) + 'px');
        }

        this.show();
        audiocontrol.setMute(this.muted);
    }

}
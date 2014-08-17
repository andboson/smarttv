var cats = {
    '0': 'Все',
    '1': 'Информационный',
    '2': 'Развлечения',
    '3': 'Детское',
    '4': 'Кино',
    '5': 'Наука',
    '6': 'Спорт',
    '7': 'Музыка',
    '8': 'Бизнес',
    '9': 'Культура'
}

var months = {
    '0' : 'января',
    '1' : 'февраля',
    '2' : 'марта',
    '3' : 'апреля',
    '4' : 'мая',
    '5' : 'июня',
    '6' : 'июля',
    '7' : 'августа',
    '8' : 'сентября',
    '9' : 'октября',
    '10' : 'ноября',
    '11' : 'декабря'
};

var days = {
    '1' : 'понедельник',
    '2' : 'вторник',
    '3' : 'среда',
    '4' : 'четверг',
    '5' : 'пятница',
    '6' : 'суббота',
    '7' : 'воскресенье'
};

/**
 *  Play Last
 */
var PlayLast = function(){

    this.idCat = '';
    this.page = '';
    this.idChannel = '';

    this.main = null;


    this.forget = function(){
        sf.core.localData('idCat', null);
        sf.core.localData('page', null);
        sf.core.localData('idChannel', null);
    }

    this.getSaved = function(){
        this.idCat = sf.core.localData('idCat');
        this.page = sf.core.localData('page');
        this.idChannel = sf.core.localData('idChannel');
    }

    this.check = function(main){

        this.getSaved();

        this.main = main;
        if(this.page.toString().length > 0 &&
            this.idCat.toString().length > 0 &&
            this.idChannel.toString().length > 0
        ){
            alert('got saved, play last');
            this.playLast(this.idCat, this.page, this.idChannel);
        }
    }

    this.remember = function(idCat, page, idChannel){
        if(!isNaN(idCat) && idCat.length > 0){
            sf.core.localData('idCat', idCat);
        }
        if( isFinite(page) && page.toString().length > 0){
            sf.core.localData('page', page);
        }
        if(!isNaN(idChannel)){
            sf.core.localData('idChannel', idChannel);
        }
    }

    this.playLast = function(idCat, page, idChannel){
        alert(idCat +"|"+ page +"|"+ idChannel);
        MainMenu.selected = idCat;
        this.main.showPlaylist(idCat);
        this.main.playlist.page = page;
        this.main.playlist.nextPage();
        $('.canalline').removeClass('selected');
        $($('.canalline')[idChannel]).addClass('selected');
    }

    this.parseCookie = function () {
        var result = [];
        alert(document.cookie);
        document.cookie.split('; ').forEach(function (e) {
            var item = e.split('=');
            result[item[0]] = item[1];
        });
        return result;
    };

}


/**
 *  misc functions
 */

function getTvTime()
{

    var tvPlugin = document.getElementById('pluginObjectTV');
//timezone
    var timeZone = tvPlugin.GetTimeZone();

    var oLocal = new Date();
    alert('oLocal value :'  + oLocal) ;

    var off  = timeZone*60*1000;//miliseconds
    alert('off value : ' + off );

    var timeStamp = oLocal.getTime() + off;
    alert('TimeStamp : ' + timeStamp) ;

    oLocal.setTime(timeStamp);
    var hours = oLocal.getHours();
    return oLocal;

}

function dateLabel(){
    var date = new Date();
    TVPlugin1 = !TVPlugin1 ? document.getElementById("pluginObjectTime") : TVPlugin1;
    var currTime = TVPlugin1.GetEpochTime();
    var myDate = new Date(currTime*1000);
    var dayNum = days[date.getDay()] == undefined ? 7 : date.getDay();
    var string = days[dayNum] + ', ';
    string += date.getDate() + ' ';
    string += months[date.getMonth()] + ' ';
    string += date.getFullYear() + ', ';
    string += sf.util.dateFormat(myDate, 'H:i');
    $('#header-label').html(string);
}

function timeLabel(){
    TVPlugin1 = !TVPlugin1 ? document.getElementById("pluginObjectTime") : TVPlugin1;
    var currTime = TVPlugin1.GetEpochTime();
    var myDate = new Date(currTime*1000);
    var timeString = sf.util.dateFormat(myDate, 'H:i');
    $('#play-screen .header p .time').html(timeString);
}


/**
 *  class loader
 */

(function(){
    document.write('<script src="app/javascript/M3u.js"></script>');
    document.write('<script src="app/javascript/PlayList.js"></script>');
    document.write('<script src="app/javascript/MainMenu.js"></script>');
    document.write('<script src="app/javascript/Epg.js"></script>');
    document.write('<script src="app/javascript/Audio.js"></script>');
    document.write('<script src="app/javascript/Display.js"></script>');
})();
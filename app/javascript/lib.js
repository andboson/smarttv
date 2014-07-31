var cats = {
    '0': 'все',
    '1': 'новости',
    '2': 'развлекательные',
    '3': 'детские',
    '4': 'фильмы',
    '5': 'познавательные',
    '6': 'культура',
    '7': 'музыкальные',
    '8': 'бизнес',
    '9': 'мода'
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
    '6' : 'субббота',
    '7' : 'воскресенье'
};

/**
 * M3u class
 * @param url
 * @constructor
 */
var M3u = function (url) {
    var url = 'http://megatv.ck.ua/megatv-promo.m3u';
    var plist = '';
    var canals = [];

    function parse(plist) {
        var splitted = plist.split(/\n/);
        for (var index = 1; index < splitted.length + 1; index = index + 2) {
            var extinf = splitted[index].split(/#EXTINF.+?id=(\w+?)\sgroup_id=(\d+?)\slogo=(.+?),\s/i);
            var canal = {
                id: extinf[1],
                group: extinf[2],
                icon: extinf[3],
                name: extinf[4],
                url: splitted[index + 1],
                raw: splitted[index]
            };
            canals.push(canal);
        }
    }

    /*
     load playlist
     */
    (function () {
        $.ajax({
            type: "GET",
            url: url,
            async: false,
            success: function (data) {
                plist = data;
                parse(plist);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('err ' + textStatus);
                alert('err2 ' + errorThrown);
            }
        });
    })();

    this.filterCanals = function (categoryId) {

        if (categoryId == 0) {
            return canals;
        }

        var filtered = [];
        for (var i = 0; i < canals.length; i++) {
            if (canals[i].group == categoryId) {
                filtered.push(canals[i]);
            }
        }

        return filtered;
    }
}


/**
 *  MainMenu class
 * @constructor
 */
MainMenu = function () {
    this.selectedCaption = '';
    this.selected = -1;
    this.categories = [];
    this.buildCats = function () {
        index = 0;
        for (catId in cats) {
            var category = {
                index: index,
                url: catId,
                name: cats[catId],
                group: catId,
                id: catId
            }
            index++;
            this.categories.push(category);
        }
    };

    this.init = function () {
        this.buildCats();
        var parent = $('#cat-list-back');
        this.list = function (callback) {
            return new PlayList(this.categories, parent, callback);
        }
    }

    this.pickSelected = function (cb) {
        if (MainMenu.selected == -1) {
            return;
        }

        if (MainMenu.selected > cb.visibleCanals - 1) {
            cb.page = Math.floor(MainMenu.selected / cb.visibleCanals);
            cb.callback = null;
            cb.nextPage();
            $('.canalline').removeClass('selected');
            $('#' + this.categories[MainMenu.selected].id).addClass('selected');
            return;
        }

        if (this.categories[MainMenu.selected] instanceof Object) {
            $('.canalline').removeClass('selected');
            $('#' + this.categories[MainMenu.selected].id).addClass('selected');
        }
    }

    this.init(null);
}


/**
 *  Playlist list class
 * @param canals
 * @param container
 * @param callback
 * @constructor
 */
PlayList = function (canals, container, callback) {

    var parent = container;
    this.callback = callback;
    this.canals = canals;
    this.page = 0;
    this.selectedIndex = 0;
    this.viewPortHeight = parseInt(parent.css('height'));
    this.visibleCanals = Math.floor(this.viewPortHeight / 64);
    this.pages = Math.round(this.canals.length / this.visibleCanals);

    this.down = function () {
        var selected = $('.canalline.selected');
        if (selected.index() == $('.canalline').last().index()) {
            this.page++;
            this.nextPage();
            return;
        }
        selected.next().addClass('selected');
        selected.removeClass('selected');
        if (Main.screen == 1) {
            epg.getDProgram();
        }
        this.selectedIndex = selected.next().index();
    }


    this.up = function () {
        alert(Main.screen);
        alert(this.page);
        var selected = $('.canalline.selected');
        if (selected.index() == 0) {
            this.page--;
            alert(this.page);
            this.prevPage();
            return;
        }
        selected.prev().addClass('selected');
        selected.removeClass('selected');
        if (Main.screen == 1) {
            epg.getDProgram();
        }
        this.selectedIndex = selected.prev().index();
    }

    this.buildPlaylistPage = function (page, selectFirst) {

        playLast.remember('', page);
        parent.html('');
        var content = '<ul id="playlist">';
        var startIndex = page * this.visibleCanals;
        var endIndex = startIndex + this.visibleCanals;
        for (var i = startIndex; i < endIndex; i++) {
            content += this.buildCanalLine(this.canals[i]);
        }
        content += '</ul>';
        parent.append(content);

        if (selectFirst != false) {
            $('.canalline').first().addClass('selected');
        } else if (selectFirst === false) {
            alert('last');
            $('.canalline').last().addClass('selected');
        } else {
            alert('hm');
        }

        if (this.callback) {
            this.callback(this);
        }

        if (Main.screen == 1) {
            epg.getDProgram();
        }

        $('#pager').html( 'Страница ' + (page + 1) + ' из ' + this.pages);
    }

    this.buildCanalLine = function (canal) {

        if (canal == undefined || canal.id == undefined) {
            return '';
        }
        var content = '<li class="canalline" id="' + canal.id + '" group="' + canal.group + '">';
        content += '<div class="in">';
        if (canal.icon !== undefined) {
            content += '<img src="' + canal.icon + '">';
        }
        content += '<a href="' + canal.url + '">' + canal.name + '</a>';
        content += '</div>';
        content += '</li>';

        return content;
    }

    this.nextPage = function () {
        if (this.page > this.pages - 1) {
            this.page = 0;
        }

        this.buildPlaylistPage(this.page);
        $('.canalline').first().addClass('selected');
        this.selectedIndex = 0;
    }

    this.prevPage = function () {
        if (this.page < 0) {
            this.page = this.pages - 1;
        }

        this.buildPlaylistPage(this.page, false);
        this.selectedIndex = (this.visibleCanals - 1);
    }

    this.buildPlaylistPage(0);
};


/**
 *  Epg class
 * @constructor
 */
var Epg = function () {
    this.url = 'http://megatv.ck.ua/program.php?sort=today&chan=';
    this.program = '';
    Epg.programs = [];

    function parse(data) {
        var end = data.indexOf('<style');
        var program = data.substr(0, end);

        return program;
    }

    Epg.scroll = function(){
        $('#epg').scrollTop(0);
        var date = new Date();
        var hour = parseInt(date.getHours());
        $('#epg-table .time').each(function(){
            var time = $(this).html().split('-');
            if( parseInt(time[0]) == parseInt(hour)){
                alert( parseInt(time[0]) +'>'+ parseInt(hour));
                var offset = $(this).offset().top;
                $('#epg').scrollTop(offset - 60);
                return;
            } else if( parseInt(time[0]) == parseInt(hour) - 1){
                alert( parseInt(time[0]) +'>'+ parseInt(hour));
                var offset = $(this).offset().top;
                $('#epg').scrollTop(offset - 60);
                return;
            }
        });
    }

    this.getDProgram = function () {

        var selectedItem = $('.canalline.selected');
        if (selectedItem == undefined) {
            return;
        }

        var channel = selectedItem.attr('id').match(/\d+/)[0];
        if (!channel) {
            return;
        }

        alert('channel' + channel);
        if (Epg.programs[channel] == undefined) {
            $('#epg-table').html('<tr><td><br><p>идет загрузка...</p></td></tr>tr>');
            $.ajax({
                type: "GET",
                url: this.url + channel,
                async: true,
                success: function (data) {
                    this.program = parse(data);
                    Epg.programs[channel] = this.program;
                    $('#epg-table').html(this.program);
                    Epg.scroll();

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('err ' + textStatus);
                }
            });
        } else {
            $('#epg-table').html(Epg.programs[channel]);
            Epg.scroll();
        }
    }
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
        this.main.handlePlayKey();
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
function dateLabel(){
    var date = new Date();
    var string = days[date.getDay()] + ', ';
    string += date.getDate() + ' ';
    string += months[date.getMonth()] + ' ';
    string += date.getFullYear() + ', ';
    string += date.getHours() + ':';
    string += date.getMinutes();

    $('#header-label').html(string);
}

function timeLabel(){
    var date = new Date();
    var timeString = date.getHours() + ':' + date.getMinutes();
    $('#play-screen .header p .time').html(timeString);
}

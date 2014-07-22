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


var m3u = function (url) {
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

    this.filterCanals = function(categoryId){
        var filtered = [];
        for(var i = 0; i < canals.length; i++){
               if( canals[i].group == categoryId){
                   filtered.push(canals[i]);
               }
        }

        return filtered;
    }
}

MainMenu = function(){
    this.selected = 0;
    this.categories = [];
    this.buildCats = function(){
        for(catId in cats){
            var category = {
                url: catId,
                name: cats[catId],
                group: catId,
                id: catId
            }

            this.categories.push(category);
        }
    };

    this.init = function(){
        this.buildCats();
        var parent = $('#cat-list-back');
        this.list = new PlayList(this.categories, parent);
    }

    this.init();
}

PlayList = function (canals, container) {
    var parent = container;
    this.canals = canals;
    this.page = 0;
    this.selectedIndex = 0;
    this.viewPortHeight = parent.height();
    this.visibleCanals = Math.floor(this.viewPortHeight / 64);
    this.pages = Math.round(this.canals.length / this.visibleCanals);

    this.down = function() {
        var selected = $('.canalline.selected');
        if (selected.index() == $('.canalline').last().index()) {
            this.page++;
            this.nextPage();
            return;
        }
        selected.next().addClass('selected');
        selected.removeClass('selected');
        this.selectedIndex = selected.next().index();
    }


    this.up = function() {
        var selected = $('.canalline.selected');
        if (selected.index() == 0) {
            this.page--;
            this.prevPage();
            return;
        }
        selected.prev().addClass('selected');
        selected.removeClass('selected');
        this.selectedIndex = selected.prev().index();
    }

    this.buildPlaylistPage = function (page) {
        parent.html('');
        var content = '<ul id="playlist">';
        var startIndex = page * this.visibleCanals;
        var endIndex = startIndex + this.visibleCanals;
        console.log(startIndex)
        console.log(endIndex)
        for (var i = startIndex; i < endIndex; i++) {
            content += this.buildCanalLine(this.canals[i]);
        }
        content += '</ul>';
        parent.append(content);
    }

    this.buildCanalLine = function(canal) {

        if (canal == undefined || canal.id == undefined ) {
            return '';
        }
        var content = '<li class="canalline" id="' + canal.id + '" group="' + canal.group + '">';
        content += '<div class="in">';
        if( canal.icon !== undefined ) {
            content += '<img src="' + canal.icon + '">';
        }
        content += '<a href="' + canal.url + '">' + canal.name + '</a>';
        content += '</div>';
        content += '</li>';

        return content;
    }

    this.nextPage = function(){
        if( this.page > this.pages - 1 ){
            this.page = 0;
        }

       this.buildPlaylistPage(this.page);
        $('.canalline').first().addClass('selected');
        this.selectedIndex = 0;
    }

    this.prevPage = function(){
        if( this.page < 0){
            this.page = this.pages - 1;
        }
        this.buildPlaylistPage(this.page);
        $('.canalline').last().addClass('selected');
        this.selectedIndex = (this.visibleCanals - 1);
    }

    this.buildPlaylistPage(0);
    $('.canalline').first().addClass('selected');
}



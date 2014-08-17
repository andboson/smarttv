

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

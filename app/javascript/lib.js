var m3u = function (url) {
    var url = 'http://192.168.0.195/megatv-promo.m3u';
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
        alert('in');
        $.ajax({
            type: "GET",
            url: url,
            async: false,
            success: function (data) {
                alert(data)
                plist = data;
                parse(plist);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('err ' + textStatus);
                alert('err2 ' + errorThrown);
            }
        });
    })();

    return {
        url: url,
        plist: function () {
            return plist;
        },
        canals: function () {
            return canals;
        },
        count: function () {
            return plist.length ? canals.length : 0;
        }
    };
}

function plist() {

    var parent = $('#container');
    var m3uObj = m3u();

    function buildPlaylist() {
        var canals = m3uObj.canals();

        var content = '<ul id="playlist">';

        for (var i = 0; i < canals.length; i++) {
            content += buildCanalLine(canals[i]);
        }
        content += '</ul>';

        parent.append(content);
        $('#playlist').find('li').first().addClass('selected');
    }

    function buildCanalLine(canal) {

        if (canal.id == undefined) {
            return '';
        }
        var content = '<li class="canalline" id="' + canal.id + '" group="' + canal.group + '">';
        content += '<img src="' + canal.icon + '">';
        content += '<a href="' + canal.url + '">' + canal.name + '</a>';
        content += '</li>';

        return content;
    }

    return {
        rawlist: m3uObj.plist(),
        canals: m3uObj.canals(),
        setContent: function () {
            return buildPlaylist();
        }
    };
}

function scollList() {

    var page = 0;
    var selectedIndex = 0;
    var viewPortHeight = $('#container').height();
    var visibleCanals = Math.floor(viewPortHeight / ($('.canalline').first().height() + 6));
    var pages = Math.ceil($('.canalline').length / visibleCanals);

    function down() {
        var selected = $('.canalline.selected');
        if(selected.index() == $('.canalline').last().index()) {
            $('.canalline').removeClass('selected');
            $('.canalline').first().addClass('selected');
            selectedIndex =  $('.canalline').first().index();
            checkPage();
            return;
        }
        selected.next().addClass('selected');
        selected.removeClass('selected');
        selectedIndex = selected.next().index();
        checkPage();
    }

    function up() {
        var selected = $('.canalline.selected');
        if(selected.index() == 0) {
            $('.canalline').removeClass('selected');
            $('.canalline').last().addClass('selected');
            selectedIndex =  $('.canalline').last().index();
            checkPage();
            return;
        }
        selected.prev().addClass('selected');
        selected.removeClass('selected');
        selectedIndex = selected.prev().index();
        checkPage();
    }

    function checkPage() {
        page = Math.floor((selectedIndex) / visibleCanals);

        $('#info').html('c' + visibleCanals + ' -- sindex' + selectedIndex + '-- ' + 'page' + page + '%' + selectedIndex % visibleCanals);
        var margin = page * (visibleCanals + 1) * ($('.canalline').first().height());
            $('#playlist').css('margin-top', '-' + (margin + 0.5) + 'px');

        //correction position
            var firstPageElement = $($('.canalline')[page * visibleCanals]);
            var topPageListElementOffset = firstPageElement.offset().top;
            var topContainerOffset = $('#container').offset().top;
            var correction = topPageListElementOffset - (topContainerOffset + 10);
            var currentMarginTop = Math.abs(parseInt($('#playlist').css('margin-top')));
            $('#playlist').css('margin-top', '-' + (currentMarginTop + correction) + 'px');
    }

    return{
        selected: selectedIndex,
        up: function () {
            return up();
        },

        down: function () {
            return down();
        }
    }
}


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

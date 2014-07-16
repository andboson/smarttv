function m3u(url) {
    var url = 'http://localhost/megatv-promo.m3u';
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

function plist(){

    var parent = $('#container');

    function buildPlaylist(){
        var m3uObj = m3u();
        var canals = m3uObj.canals();

        var content = '<ul>';

        for(var i = 0; i < canals.length; i++){
            content += buildCanalLine(canals[i]);
        }
        content += '</ul>';

        parent.append(content);
    }

    function buildCanalLine(canal){

        if( canal.id == undefined) {
            return '';
        }
        var content = '<li class="canalline" id="'+ canal.id +'" group="'+ canal.group + '">';
        content += '<img src="'+canal.icon+'">';
        content += '<a href="'+canal.url+'">' + canal.name + '</a>';
        content += '</li>';

        return content;
    }

    return {
      content: function(){
          return buildPlaylist();
      }
    };
}

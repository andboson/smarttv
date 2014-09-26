
/**
 *  Epg class
 * @constructor
 */
var Epg = function () {
    this.url = 'http://megatv.ck.ua/smarttv/?channel=';
    this.program = '';
    Epg.programs = [];

    function parse(data) {
        var end = data.indexOf('<style');
        var program = data.substr(0, end);

        return program;
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
            $('#epg-table').html('<tr><td><br><p>идет загрузка...</p></td></tr>tr>');
            $.ajax({
                type: "GET",
                url: this.url + channel,
                async: true,
                success: function (data) {
                    this.program = data;
                    Epg.programs[channel] = this.program;
                    var html = Epg.drawProgramm(data);
                    $('#epg-table').html(html);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('err ' + textStatus);
                }
            });
    }


};

Epg.drawProgramm = function(channelProgramm){
    var output = '';
    for(index in channelProgramm){
        var startArr = channelProgramm[index].start.split(' ')[1].split(':');
        var stopArr = channelProgramm[index].stop.split(' ')[1].split(':');
        var oddity = index % 2 == 0 ? 'odd' : '';
        output += '<tr class="' + oddity + '">';
        output += '<td class="first" valign="top">' + startArr[0] + ':' + startArr[1];
        output += ' - ' + stopArr[0] + ':' + stopArr[1] + '</td>';
        output += '<td>' + channelProgramm[index].title + '</td>';
        output += '</tr>';
    }

    output += '';

    return output;
}
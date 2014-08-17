
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
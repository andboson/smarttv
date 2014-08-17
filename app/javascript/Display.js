var Display = {
    ui: null
}

Display.init = function(){
    this.ui = $('#display');
}

Display.status = function(status){
    alert('--status');
    this.ui.find('.text').html(status);
    this.ui.show();
}

Display.hide = function(){
    this.ui.hide();
}
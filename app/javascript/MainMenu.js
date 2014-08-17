
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

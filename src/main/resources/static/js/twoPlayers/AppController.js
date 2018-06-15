;
'use strict';

var AppController = function(model, view) {
    var AppController = this;
    this.model = model;
    this.view = view;

    this.init = function() {
        AppController.mouse = new MouseController(view.canvas, AppController.move, AppController.click);
        AppController.newGame(1);
    };

    this.newGame = function(a) {
        this.view.renderBoard();
        this.model.setStartData();
    };

    this.moveUser = function() {
        if (!this.model.emptyCell())
            return;
        var nm = this.model.moveUser();
        this.view.renderMove(nm);
        this.view.setStyleCursorDefault();
        if (!this.model.playing)
            this.view.renderWinLine();
    };

    this.move = function(x, y) {
        if (!AppController.model.playing)
            return;
        AppController.nm = AppController.view.setStyleCursor(x, y);
        AppController.model.setNM(AppController.nm);
    };

    this.click = function() {
        if (!AppController.model.playing || !AppController.model.canClick)
            return;
        AppController.moveUser();
    };

    this.init();
};
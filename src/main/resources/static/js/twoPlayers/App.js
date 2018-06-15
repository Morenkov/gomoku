;
'use strict';

(new function() {
    var App = this;
    this.files = ['js/lib.js', 'js/twoPlayers/AppModel.js', 'js/twoPlayers/AppView.js', 'js/twoPlayers/AppController.js', 'js/twoPlayers/MouseController.js'];
    this.model;
    this.view;
    this.controller;

    this.init = function() {
        this.model = new AppModel();
        this.view = new AppView(this.model);
        this.controller = new AppController(this.model, this.view);

        $.ajaxSetup({
            headers: {
                'token': JSON.parse(localStorage.getItem('user')).token
            }
        });
    };

    return function() {
        if (localStorage.hasOwnProperty('type') && localStorage.hasOwnProperty('user')&& localStorage.hasOwnProperty('game')) {
            var head = document.getElementsByTagName('head')[0];
            for (var i in App.files) {
                var script = document.createElement('script');
                script.src = App.files[i];
                script.onload = App.start;
                head.appendChild(script);
            }
            window.onload = App.init;
        }
    };
})();
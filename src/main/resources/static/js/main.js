;
var mainApp = (function () {
    var me = JSON.parse(localStorage.getItem("user")),
        friends = [];

    function getFriends() {
        $.ajax({
            url: "/getFriends",
            method: "POST",
            data: {id: me.id},
            success: function (answer) {
                var i = 0,
                    $list = $('.friends'),
                    $friends = null,
                    $btns = null,
                    html = '';
                console.log(answer);
                friends = answer;

                for (i = 0; i < friends.length; i += 1) {
                    html += '<li class="list-group-item friend">' + friends[i].firstName + ' ' + friends[i].lastName +
                        '<a class="btn btn-default right">Удалить</a></li>';
                }

                $list.html(html);
                $friends = $('.friend');
                $btns = $('.right');

                for (i = 0; i < $friends.length; i += 1) {
                    $friends[i].current = i;
                    $btns[i].current = i;

                    $friends[i].addEventListener('click', function () {
                        showProfile(friends[this.current]);
                    });
                    $btns[i].addEventListener('click', function (e) {
                        var friend = friends[this.current];

                        e.stopPropagation();

                        $.ajax({
                            url: "/deleteFriend",
                            method: 'POST',
                            data: {meId: me.id, friendId: friend.id},
                            success: function (request) {
                                getFriends();
                            },
                            error: function (error) {
                                console.log(error);
                            }
                        });
                    });
                }
            },
            error: function (error) {
                console.log(error);
                alert(error);
            }
        });
    }

    function showProfile(user) {
        if (user.id === me.id) {
            $('.panel-heading:eq(0)').html('Мой аккаунт');
        } else {
            $('.panel-heading:eq(0)').html('Аккаунт друга');
        }

        $('.name').html(user.firstName);
        $('.surname').html(user.lastName);
        $('.login').html(user.login);
        $('.email').html(user.email);
        $('.total-games').html(user.wonGames + user.lostGames);
        $('.win').html(user.wonGames);
        $('.lose').html(user.lostGames);

        if (user.lostGames !== 0) {
            $('.reit').html(Math.floor(user.wonGames / user.lostGames));
        } else {
            $('.reit').html(1);
        }
    }

    function initialize() {
        showProfile(me);
        getFriends();
    }

    return {
        initialize: initialize,
        me: me,
        showProfile: showProfile
    };
}());

$('document').ready(function () {
    $.ajaxSetup({
        headers: {
            'token': mainApp.me.token
        }
    });

    mainApp.initialize();
});
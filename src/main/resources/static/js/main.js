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
                    html = '';
                console.log(answer);
                friends = answer;

                for (i = 0; i < friends.length; i += 1) {
                    html += '<li class="list-group-item friend">' + friends[i].firstName + ' ' + friends[i].lastName + '</li>';
                }

                $list.html(html);
                $friends = $('.friend');

                for (i = 0; i < $friends.length; i += 1) {
                    $friends[i].current = i;
                    $friends[i].addEventListener('click', function () {
                        showProfile(friends[this.current]);
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

        if (user.lostGames) {
            $('.reit').html(Math.floor(user.wonGames / user.lostGames * 100));
        } else {
            $('.reit').html(1);
        }
    }

    function changePassword() {
        var $form = $('#change-password'),
            oldPass = $('old-pass').val(),
            newPass = $('new-pass').val();

        $form.on('submit', function (e) {
            e.preventDefault();

            $.ajax({
                url: "",
                data: {password: oldPass},
                method: "POST",
                success: function (request) {
                    console.log(request);

                    if (request) {
                        $.ajax({
                            url: "/updateUser",
                            method: "POST",
                            data: {
                                id: me.id,
                                password: newPass,
                                firstName: me.firstName,
                                lastName: me.lastName,
                                wonGames: me.wonGames,
                                lostGames: me.lostGames
                            },
                            success: function (anwer) {
                                console.log(anwer);
                            },
                            error: function (error) {
                                console.log(error);
                                alert(error);
                            }
                        });
                    }
                },
                error: function (error) {
                    console.log(error);
                    alert(error);
                }
            });
        });
    }

    function initialize() {
        showProfile(me);
        changePassword();
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
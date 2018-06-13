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
                console.log(answer);
                friends = answer;
            },
            error: function (error) {
                console.log(error);
                alert(error);
            }
        });
    }

    function showProfile() {
        $('.email').html(me.email);
        $('.total-games').html(me.wonGames + me.lostGames);
        $('.win').html(me.wonGames);
        $('.lose').html(me.lostGames);

        if (me.lostGames) {
            $('.reit').html(Math.floor(me.wonGames / me.lostGames * 100));
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
        $('.logout').on('click', function (e) {
            $.ajax({
                url: "/logout",
                method: "POST",
                data: {id: me.id},
                success: function (anwer) {
                    console.log(anwer);
                }
            });
        });
        showProfile();
        changePassword();
        getFriends();
    }

    return {
        initialize: initialize,
        me: me
    };
}());

$('document').ready(function () {
    $.ajaxSetup({
        headers: {
            'token': mainApp.me.token
        }
    });

    console.log(mainApp.me.token);
    mainApp.initialize();
});
var mainApp = (function () {
    var me = JSON.parse(localStorage.getItem("user")),
        searchedUsers = [],
        searchedGames = [];

    function initialize() {
        initializeSearch();
        showGames();
    }

    function showGames() {
        $.ajax({
            url: '/getFreeGames',
            method: 'POST',
            success: function (answer) {
                var html = '', i = 0,
                    $games = null;
                console.log(answer);

                searchedGames = answer;

                if (searchedGames) {
                    //отрисовка найденных игр
                    for (i = 0; i < searchedGames.length; i += 1) {
                        //пропустить то, что создал я
                        if (searchedGames[i].firstPlayerId === me.id) {
                            continue;
                        }

                        html += '<li class="list-group-item game">Играть против ' + searchedGames[i].opponentName + ' ' + searchedGames[i].opponentSurname + '</li>';
                    }

                    $('.searched-games').html(html);

                    $games = $('.game');

                    for (i = 0; i < $games.length; i += 1) {
                        $games[i].current = i;
                        //событие на нажатие
                        $games[i].addEventListener('click', function () {
                            var answ = false,
                                game = searchedGames[this.current];

                            answ = confirm('Присоединиться к игре?');

                            if (answ) {
                                $.ajax({
                                    url: '/joinGame',
                                    method: 'POST',
                                    data: {userId: me.id, gameId: game.id},
                                    success: function (answer) {
                                        console.log(answer);
                                    },
                                    error: function (error) {
                                        console.log(error);
                                        alert('server error');
                                    }
                                });
                            }
                        });
                    }
                }
            },
            error: function (error) {
                console.log(error);
                alert('server error');
            }
        });
    }

    function initializeSearch() {
        var $field = $('#search'),
            $btn = $('#start-search');

        $btn.on('click', function () {
            var value = $field.val();

            $.ajax({
                url: '/searchUsers',
                method: 'POST',
                data: {searchQuery: value},
                success: function (request) {
                    var html = '', i = 0,
                        $users = null,
                        $usersField = $('.searched-users');

                    if (request) {
                        searchedUsers = request;

                        for (i = 0; i < searchedUsers.length; i += 1) {
                            if (searchedUsers[i].id === me.id) {
                                continue;
                            }
                            html += '<li class="list-group-item user">' + searchedUsers[i].firstName + ' ' + searchedUsers[i].lastName + '</li>';
                        }

                        $usersField.html(html);

                        $users = $('.user');

                        for (i = 0; i < $users.length; i += 1) {
                            $users[i].current = i;
                            $users[i].addEventListener('click', function () {
                                var answ = false,
                                    newFriend = searchedUsers[this.current];

                                answ = confirm('Добавить друга?');

                                if (answ) {
                                    $.ajax({
                                        url: '/addFriend',
                                        method: 'POST',
                                        data: {meId: +me.id, friendId: +newFriend.id},
                                        success: function (answer) {
                                            console.log(answer);
                                        },
                                        error: function (error) {
                                            console.log(error);
                                            alert('server error');
                                        }
                                    });
                                }
                            });
                        }
                    }
                },
                error: function (error) {
                    console.log(error);
                    alert('server error');
                }
            });
        });
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

    mainApp.initialize();
});
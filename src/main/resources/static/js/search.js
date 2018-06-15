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
            url: '/getFreeGames', //получение свободных игр ->RESTController
            method: 'POST',
            success: function (answer) {
                var html = '', i = 0,
                    $games = null;

                console.log(answer);

                searchedGames = answer;

                if (searchedGames) {
                    //отрисовка найденных игр
                    for (i = 0; i < searchedGames.length; i += 1) {
                        //пропустить те игры, что создал я
                        if (searchedGames[i].firstPlayerId === me.id) {
                            continue;
                        }

                        html += '<li class="list-group-item game">Играть против ' + searchedGames[i].opponentName + ' ' + searchedGames[i].opponentSurname + '</li>';
                    }

                    $('.searched-games').html(html);

                    $games = $('.game');

                    for (i = 0; i < $games.length; i += 1) {
                        $games[i].current = i;

                        $games[i].addEventListener('click', function () { //установка событий на клик
                            var answ = false,
                                game = searchedGames[this.current];

                            answ = confirm('Присоединиться к игре?');

                            if (answ) {
                                $.ajax({
                                    url: '/joinGame', //присоединение к игре ->RESTController
                                    method: 'POST',
                                    data: {userId: me.id, gameId: game.id},
                                    success: function (answer) {
                                        console.log(answer);
                                        if (answer) {
                                            game.secondPlayerId = me.id;
                                            localStorage.setItem('type', '2'); //сохранение игры и символа локально
                                            localStorage.setItem('game', JSON.stringify(game));

                                            location.replace('/gameUsers'); //перенаправление страницы
                                        }
                                    },
                                    error: function (error) {
                                        console.log(error);
                                    }
                                });
                            }
                        });
                    }
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    function initializeSearch() {
        var $field = $('#search'), //поле поиска
            $btn = $('#start-search'); //кнопка старта поиска

        $btn.on('click', function () {
            var value = $field.val();

            $.ajax({
                url: '/searchUsers',  //поиск пользователей по логину ->RESTController
                method: 'POST',
                data: {searchQuery: value},
                success: function (request) {
                    var html = '', i = 0,
                        $users = null,
                        $usersField = $('.searched-users');

                    if (request) {
                        searchedUsers = request;

                        for (i = 0; i < searchedUsers.length; i += 1) { //отрисовка найленных юзеров, кроме самого себя
                            if (searchedUsers[i].id === me.id) {
                                continue;
                            }
                            html += '<li class="list-group-item user">' + searchedUsers[i].firstName + ' ' + searchedUsers[i].lastName + '</li>';
                        }

                        $usersField.html(html);

                        $users = $('.user');

                        for (i = 0; i < $users.length; i += 1) { //установка событий на клик по списку пользователей
                            $users[i].current = i;               //для добавления их в друзья
                            $users[i].addEventListener('click', function () {
                                var answ = false,
                                    newFriend = searchedUsers[this.current];

                                answ = confirm('Добавить друга?');

                                if (answ) {
                                    $.ajax({
                                        url: '/addFriend', //добавление друга ->RESTController
                                        method: 'POST',
                                        data: {meId: +me.id, friendId: +newFriend.id},
                                        success: function (answer) {
                                            console.log(answer);
                                        },
                                        error: function (error) {
                                            console.log(error);
                                        }
                                    });
                                }
                            });
                        }
                    }
                },
                error: function (error) {
                    console.log(error);
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
            'token': mainApp.me.token //добавление токена в заголовок запроса
        }
    });

    mainApp.initialize();
});
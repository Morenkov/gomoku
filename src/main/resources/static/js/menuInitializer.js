;
$('document').ready(function () {
    $('.create-game').on('click', function () {
        var answ = false;

        answ = confirm('Создать новую игру?');

        if (answ) {
            $.ajax({
                url: "/createGame",
                method: 'POST',
                data: {userId: me.id},
                success: function (request) {
                    console.log(request);

                    if (request) {
                        localStorage.setItem('game', JSON.stringify(request));
                        localStorage.setItem('type', '1');
                        location.replace('/gameUsers');
                    }
                },
                error: function (error) {
                    console.log(error);
                    alert(error);
                }
            });
        }
    });

    $('.logout').on('click', function () {
        $.ajax({
            url: "/logout",
            method: "POST",
            data: {id: mainApp.me.id},
            success: function (answer) {
                console.log(asnwer);
                localStorage.removeItem('user');
                location.replace('/signin');
            }
        });
    });

    $('.my-account').on('click', function () {
        mainApp.showProfile(mainApp.me);
    });

    $('.go-to-profile').on('click', function () {
        var answer = confirm('Вы не сможете продолжить иггру, продолжить?');

        if (answer) {
            location.replace('/profile');
        }
    });
});
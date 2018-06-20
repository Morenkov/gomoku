///<reference path="jquery-3.3.1.min.js">
///<reference path="jquery.validate.js">

$('#form').validate({
    rules: {
        email: {
            required: true,
            email: true,
            minlength: 6
        },
        password: {
            required: true,
            minlength: 6,
            maxlength: 20
        }
    },
    errorClass: "invalid",
    messages: {
        email: {
            required: 'Введите e-mail',
            email: 'Введите корректный адрес',
            minlength: 'Минимум 6 символов'
        },
        password: {
            required: 'Введите пароль',
            maxlength: 'Максимум 20 символов',
            minlength: 'Минимум 6 символов'
        }
    }
});

$('document').ready(function () {
    var $email = $('#email'), //считывание всех инпутов
        $password = $('#password'),
        $passError = $('#password-error'),
        $emailError = $('#email-error');

    $email.on('focus', function (e) { //удаление выделения крассным при изменении поля
        $(this).removeClass('invalid');
        $emailError[0].innerHTML = '';
    });

    $password.on('focus', function (e) { //удаление выделения крассным при изменении поля
        $(this).removeClass('invalid');
        $passError[0].innerHTML = '';
    });

    $('.send').on('click', function (e) {
        var a = $email.val();
        e.preventDefault();
        //проверка, зареган ли такой пользователь
        $.ajax({
            url: '/emailAlreadyExists', //существование почты ->RESTController
            data: {email: a},
            method: 'POST',
            success: function (request) {
                console.log(request);
                if (request) {
                    $.ajax({
                        url: '/authorization', //попытка авторизации пользователя ->RESTController
                        data: {login: $email.val(), password: $password.val()},
                        method: 'POST',
                        success: function (answer) {
                            var $input = $('#token'); //считывание поля для передачи в него токена

                            switch (answer) {
                                case "Такого пользователя нет":
                                case "Неверный пароль":
                                    $password.addClass('invalid'); //сообщение об ошибке
                                    $passError.css('display', 'block');
                                    $passError.html(answer);
                                    break;
                                default:
                                    localStorage.setItem("user", JSON.stringify(answer)); //сохранение юзера локально
                                    $input.val(answer.token); //передача токена в поле
                                    $('#form').submit(); //отправка формы для захода на сайт
                                    break;
                            }
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });
                } else {
                    $email.addClass('invalid'); //сообщение об ошибке
                    $emailError.css('display', 'block');
                    $emailError.html('Некорректный email');
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});
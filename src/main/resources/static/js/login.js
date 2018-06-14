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
    errorClass: "invalid"
});

$('document').ready(function () {
    var $email = $('#email'),
        $password = $('#password');
        $passError = $('#password-error'),
        $emailError = $('#email-error');

    $email.on('focus', function (e) {
        $(this).removeClass('invalid');
        $emailError[0].innerHTML = '';
    });

    $password.on('focus', function (e) {
        $(this).removeClass('invalid');
        $passError[0].innerHTML = '';
    });

    $('.send').on('click', function (e) {
        var a = $email.val();
        e.preventDefault();
        //проверка, зареган ли такой пользователь
        $.ajax({
            url: '/emailAlreadyExists',
            data: {email: a},
            method: 'POST',
            success: function (request) {
                console.log(request);
                if (request) {
                    $.ajax({
                        url: '/authorization',
                        data: {login: $email.val(), password: $password.val()},
                        method: 'POST',
                        success: function (answer) {
                            var $input = $('#token');
                            switch (answer) {
                                case "User is not activated yet":
                                    $login.addClass('invalid');
                                    $emailError.css('display', 'block');
                                    $emailError.html(answer);
                                    break;
                                case "No Such User":
                                case "Incorrect password":
                                    $password.addClass('invalid');
                                    $passError.css('display', 'block');
                                    $passError.html(answer);
                                    break;
                                default:
                                    localStorage.setItem("user", JSON.stringify(answer));
                                    $input.val(answer.token);
                                    $('#form').submit();
                                    break;
                            }
                        },
                        error: function (error) {
                            console.log(error);
                            alert('server error');
                        }
                    });
                } else {
                    $email.addClass('invalid');
                    $emailError.css('display', 'block');
                    $emailError.html('Incorrect login or email');
                }
            },
            error: function (error) {
                console.log(error);
                alert('server error');
            }
        });
    });
});
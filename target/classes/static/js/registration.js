///<reference path="jquery-3.3.1.min.js">
///<reference path="jquery.validate.js">

$.validator.addMethod("lettersDegitsOnly", function (value, element) {
    var regexp = /^[\-а-яА-Яa-zA-Z0-9]+$/i;
    return this.optional(element) || regexp.test(value);
}, "Please enter letters or digits only");

$.validator.addMethod("lettersOnly", function (value, element) {
    var regexp = /^[\-а-яА-Яa-zA-Z]+$/i;
    return this.optional(element) || regexp.test(value);
}, "Please enter letters only");


$('#form').validate({
    rules: {
        email: {
            required: true,
            email: true,
            maxlength: 35
        },
        name: {
            required: true,
            lettersOnly: true,
            minlength: 3
        },
        surname: {
            required: true,
            lettersOnly: true,
            minlength: 3
        },
        login: {
            required: true,
            minlength: 6,
            lettersDegitsOnly: true
        },
        password: {
            required: true,
            minlength: 6,
            maxlength: 20
        },
        confirmPass: {
            equalTo: '#password',
            required: true
        }
    },
    errorClass: "invalid",
    messages: {
        email: {
            required: 'Введите e-mail',
            email: 'Введите корректный адрес',
            maxlength: 'Максимум 35 символов'
        },
        password: {
            required: 'Введите пароль',
            maxlength: 'Максимум 20 символов',
            minlength: 'Минимум 6 символов'
        },
        name: {
            required: 'Это поле обязательно',
            lettersOnly: 'Вводите только буквы',
            minlength: 'Минимальная длина 3 символа'
        },
        surname: {
            required: 'Это поле обязательно',
            lettersOnly: 'Вводите только буквы',
            minlength: 'Минимальная длина 3 символа'
        },
        login: {
            required: 'Это поле обязательно',
            minlength: 'Минимальная длина 6 символов',
            lettersDegitsOnly: 'Вводите только буквы и цифры'
        },
        confirmPass: {
            equalTo: 'Пароли не совпадают',
            required: 'Это поле обязательно'
        }
    }
});

$('document').ready(function () {
    var $firstName = $("#name"), //считывание всех инпутов
        $surname = $("#surname"),
        $login = $("#login"),
        $email = $("#email"),
        $password = $("#password"),
        $confirmPass = $("#confirmPass"),
        $loginError = $('#login-error'), //считывание лейблов для вывода оишбки
        $emailError = $('#email-error'),
        isLoginValide = false,
        isEmailValide = false;

    $('.send').on('click', function (e) {
        var login = $login.val().trim(), //считывание значений с полей
            email = $email.val().trim(),
            password = $password.val().trim(),
            firstName = $firstName.val().trim(),
            confimPass = $confirmPass.val().trim(),
            lastName = $surname.val().trim();

        e.preventDefault();

        if (checkOnFieldsFullFill() && confimPass === password) {
            checkLoginExist($login.val());
            checkEmailExist($email.val());

            setTimeout(function () {
                if (isLoginValide && isEmailValide) {
                    $.ajax({
                        url: '/setUser',
                        data: {
                            login: login,
                            email: email,
                            password: password,
                            firstName: firstName,
                            lastName: lastName,
                            wonGames: 0,
                            lostGames: 0
                        },
                        method: 'POST',
                        success: function (request) {
                            console.log(request);
                            if (request) {
                                location.replace('/signin');
                            } else {
                                alert('Мы не можем создать пользователя с текущими параметрами');
                            }
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });
                }
            }, 1000);
        }

        function checkOnFieldsFullFill() {
            return login.length > 3 && firstName.length > 3 && lastName.length > 3 && email.length > 6 && password.length > 6;
        }
    });


    function checkLoginExist(login) {
        $.ajax({
            url: '/loginAlreadyExists',
            data: {login: login},
            method: 'POST',
            success: function (request) {
                if (!request) {
                    isLoginValide = true;
                } else {
                    isLoginValide = false;
                    $login.addClass('invalid');
                    $loginError.css('display', 'block');
                    $loginError.html('Логин уже используется');
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    function checkEmailExist(email) {
        $.ajax({
            url: '/emailAlreadyExists',
            data: {email: email},
            method: 'POST',
            success: function (request) {
                if (!request) {
                    isEmailValide = true;
                } else {
                    isEmailValide = false;
                    $email.addClass('invalid');
                    $emailError.css('display', 'block');
                    $emailError.html('Email уже используется');
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
});
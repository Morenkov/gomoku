;
'use strict';

var AppModel = function () {
    var AppModel = this;

    this.m; // Номер ячейки по горизонтали (номер столбца)
    this.n; // Номер ячейки по вертикали (номер строки)
    this.size = 15; // Размер поля (15х15 ячеек)
    this.who; // Логическая переменная - за кого играет пользователь: true - X, false - O
    this.matrix; // Матрица игрового поля 15х15. 0 - свободная клетка, 1 - крестик, 2 - нолик
    this.freeCells; // Количество свободных ячеек. В начале каждой игры = 225
    this.hashStep; // Хеш-массив потенциальных ходов
    this.playing; // True - игра в процессе игры (пользователь может кликать на поле и т.д.)
    this.winLine; // Координаты победной линии
    this.step = 0; // Счетчик ходов игры\
    this.user;
    this.game;
    this.canClick;
    this.gameState;
    this.prePattern = [ // Шаблоны построения фигрур и их веса. Х в дальнейшем заменяется на крестик (1) или нолик (0), 0 - свободная ячейка
        {s: 'xxxxx', w: 99999}, // пять в ряд (финальная выигрышная линия)
        {s: '0xxxx0', w: 7000}, // Открытая четверка
        {s: '0xxxx', w: 4000}, // Закрытая четверка
        {s: 'xxxx0', w: 4000},
        {s: '0x0xxx', w: 2000},
        {s: '0xx0xx', w: 2000},
        {s: '0xxx0x', w: 2000},
        {s: 'xxx0x0', w: 2000},
        {s: 'xx0xx0', w: 2000},
        {s: 'x0xxx0', w: 2000},
        {s: '0xxx0', w: 3000},
        {s: '0xxx', w: 1500},
        {s: 'xxx0', w: 1500},
        {s: '0xx0x', w: 800},
        {s: '0x0xx', w: 800},
        {s: 'xx0x0', w: 800},
        {s: 'x0xx0', w: 800},
        {s: '0xx0', w: 200}
    ];
    this.pattern = [[], [], []]; // Массив шаблонов для Х и 0, генерируется из предыдущих шаблонов
    this.patternWin = [0, /(1){5}/, /(2){5}/, /[01]*7[01]*/, /[02]*7[02]*/]; // Массив выигрышных шаблонов [1] и [2] и шаблон определения возможности поставить 5 в ряд

    this.init = function () {
        var type = localStorage.getItem('type');

        switch (type) {
            case "1":
                this.who = true;
                break;
            case "2":
                this.who = false;
                break;
            default:
                this.who = true;
        }
        this.user = JSON.parse(localStorage.getItem('user'));
        this.game = JSON.parse(localStorage.getItem('game'));

        setInterval(function () {
            var game = AppModel.game;

            $.ajax({
                url: "/getGame",
                method: 'POST',
                data: {id: game.id},
                success: function (request) {
                    var countX = 0,
                        countO = 0,
                        i = 0;

                    if (request) {
                        console.log(request);
                        AppModel.gameState = request.gameState;

                        if (request.winnerId && request.winnerId !== AppModel.user.id){
                            alert('Вы програли!');
                            localStorage.removeItem('type');
                            localStorage.removeItem('game');
                            location.replace('/profile');
                        }

                        for (i = 0; i < AppModel.gameState.length; i += 1) {
                            if (AppModel.gameState[i] == '1') {
                                countX++;
                            }
                            if (AppModel.gameState[i] == '2') {
                                countO++;
                            }
                        }

                        AppModel.matrix = getMatrixFromString(AppModel.gameState);

                        if (AppModel.who && countX === countO || !AppModel.who && countX > countO) {
                            AppModel.canClick = true;
                        }
                    }
                },
                error: function (error) {
                    console.log(error);
                    alert('server error');
                }
            });
        }, 4000);
    };

    this.setStartData = function (a) { // Начальные установки для каждой новой игры
        this.matrix = [];
        this.winLine = [];
        this.hashStep = {7: {7: {sum: 0, attack: 1, defence: 0, attackPattern: 0, defencePattern: 0}}}; // первый шаг, если АИ играет за Х
        this.freeCells = this.size * this.size;
        for (var n = 0; n < this.size; n++) {
            this.matrix[n] = [];
            for (var m = 0; m < this.size; m++) {
                this.matrix[n][m] = 0;
            }
        }
        this.step = 0;
        this.playing = true;
        this.canClick = false;
    };

    this.setNM = function (a) { // Установка координат текущего хода
        this.n = a.n;
        this.m = a.m;
    };

    this.emptyCell = function () { // Проверка ячейки на доступность для хода
        return this.matrix[this.n][this.m] === 0;
    };

    this.moveUser = function () { // Ход пользователя
        this.playing = false;    // Запрещаем кликать, пока идет расчет
        return this.move(this.n, this.m);
    };

    this.move = function (n, m) { // Ход пользователя
        this.canClick = false;
        this.matrix[n][m] = 2 - this.who; // Сохранение хода в матрице полей игры
        this.freeCells--;
        var t = this.matrix[this.n][this.m]; // Далее идет проверка на выигрыш в результате этого хода: поиск 5 в ряд по 4 направлениям | — / \
        var s = ['', '', '', ''];
        var nT = Math.min(this.n, 4);
        var nR = Math.min(this.size - this.m - 1, 4);
        var nB = Math.min(this.size - this.n - 1, 4);
        var nL = Math.min(this.m, 4);
        for (var j = this.n - nT; j <= this.n + nB; j++)
            s[0] += this.matrix[j][this.m];
        for (var i = this.m - nL; i <= this.m + nR; i++)
            s[1] += this.matrix[this.n][i];
        for (var i = -Math.min(nT, nL); i <= Math.min(nR, nB); i++)
            s[2] += this.matrix[this.n + i][this.m + i];
        for (var i = -Math.min(nB, nL); i <= Math.min(nR, nT); i++)
            s[3] += this.matrix[this.n - i][this.m + i];
        var k;
        if ((k = s[0].search(this.patternWin[t])) >= 0)
            this.winLine = [this.m, this.n - nT + k, this.m, this.n - nT + k + 4];
        else if ((k = s[1].search(this.patternWin[t])) >= 0)
            this.winLine = [this.m - nL + k, this.n, this.m - nL + k + 4, this.n];
        else if ((k = s[2].search(this.patternWin[t])) >= 0)
            this.winLine = [this.m - Math.min(nT, nL) + k, this.n - Math.min(nT, nL) + k, this.m - Math.min(nT, nL) + k + 4, this.n - Math.min(nT, nL) + k + 4];
        else if ((k = s[3].search(this.patternWin[t])) >= 0)
            this.winLine = [this.m - Math.min(nB, nL) + k, this.n + Math.min(nB, nL) - k, this.m - Math.min(nB, nL) + k + 4, this.n + Math.min(nB, nL) - k - 4, -1];
        this.playing = (this.freeCells !== 0 && this.winLine.length === 0); // Проверка на окончание игры (победа или нет свободных ячеек)

        this.gameState = this.matrix.join('').split(',').join('');

        if (!this.playing){
            $.ajax({
                url: "/setWinner",
                method: 'POST',
                data: {winnerId: this.user.id, gameId: this.game.id},
                success: function (request) {
                    console.log(request);
                    alert('Вы выиграли!');
                    location.replace('/profile');
                },
                error: function (error) {
                    console.log(error);
                    alert(error);
                }
            });
        }

        $.ajax({
            url: "/changeGameState",
            method: 'POST',
            data: {id: this.game.id, gameState: this.gameState},
            success: function (request) {
                console.log(request);
            },
            error: function (error) {
                console.log(error);
                alert(error);
            }
        });
        return {n: n, m: m};
    };

    this.init();
};
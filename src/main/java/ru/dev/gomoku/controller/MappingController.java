package ru.dev.gomoku.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.dev.gomoku.BLL.BLL;

@Controller
public class MappingController {

    private final BLL bll;

    public MappingController(BLL bll) {
        this.bll = bll;
    }

    //@GetMapping - указывает возвращаемый шаблон для указанного url адреса
    //Имя шаблона ищется в папке templates и возвращается пользователю
    @GetMapping("/")
    public String root() {
        return "redirect:/signin";
    }

    @GetMapping("/signin")
    public String signin() {
        return "Signin";
    }

    //Проверка на вход пользователя. Если есть токен, то перевод на стрнаницу аккаунта
    //Если нет, то перевод на страницу входа
    @PostMapping("/enter")
    public String enter(@RequestParam String token) {
        return bll.checkToken(token) ? "redirect:/profile" : "redirect:/signin";
    }

    @GetMapping("/profile")
    public String main() {
        return "account";
    }

    @GetMapping("/game")
    public String game() {
        return "GamePage";
    }

    @GetMapping("/gameUsers")
    public String gameUsers() {
        return "Game";
    }

    @GetMapping("/search")
    public String search() {
        return "Gameroom";
    }

    @GetMapping("/signup")
    public String signup() {
        return "Signup";
    }

    //При выходе, удаляется токен для текущего юзера из бизнес-логики
    @PostMapping("/logout")
    public String logout(@RequestParam String token) {
        bll.removeToken(token);
        return "redirect:/signin";
    }
}

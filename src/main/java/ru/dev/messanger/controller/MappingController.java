package ru.dev.messanger.controller;

import com.google.gson.Gson;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.dev.messanger.BLL.BLL;
import ru.dev.messanger.entities.NewUserDTO;

@Controller
public class MappingController {

    private final BLL bll;

    public MappingController(BLL bll) {
        this.bll = bll;
    }

    @GetMapping("/")
    public String root() {
        return "redirect:/signin";
    }

    @GetMapping("/signin")
    public String signin() {
        return "Signin";
    }

    @PostMapping("/enter")
    public String enter(@RequestParam String token) {
        return bll.checkToken(token) ? "redirect:/main" : "redirect:/signin";
    }

    @GetMapping("/main")
    public String main() {
        return "account";
    }

    @GetMapping("/game")
    public String game() {
        return "GamePage";
    }

    @GetMapping("/search")
    public String search() {
        return "Gameroom";
    }

    @GetMapping("/signup")
    public String signup() {
        return "Signup";
    }

    @PostMapping("/logout")
    public String logout(@RequestParam String token) {
        bll.removeToken(token);
        return "redirect:/signin";
    }
}

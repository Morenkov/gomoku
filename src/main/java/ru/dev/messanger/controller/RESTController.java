package ru.dev.messanger.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.dev.messanger.BLL.BLL;
import ru.dev.messanger.entities.NewUserDTO;

import javax.validation.Valid;


@RestController
public class RESTController {

    private final BLL bll;

    public RESTController(BLL bll) {
        this.bll = bll;
    }

    @RequestMapping(value = "/authorization", method = RequestMethod.GET, produces = "application/json")
    public String authorization(@RequestParam String login, @RequestParam String password) {
        return bll.authorization(login, password);
    }

    @RequestMapping(value = "/emailAlreadyExists", method = RequestMethod.GET, produces = "application/json")
    public String emailAlreadyExists(@RequestParam String email) {
        return bll.emailAlreadyExists(email);
    }

    @RequestMapping(value = "/loginAlreadyExists", method = RequestMethod.GET, produces = "application/json")
    public String loginAlreadyExists(@RequestParam String login) {
        return bll.loginAlreadyExists(login);
    }

    @RequestMapping(value = "/setUser", method = RequestMethod.GET, produces = "application/json")
    public String setUser(
            @RequestParam String email,
            @RequestParam String login,
            @RequestParam String password,
            @RequestParam String first_name,
            @RequestParam String last_name,
            @RequestParam int wonGames,
            @RequestParam int lostGames) {
        return bll.setUser(email, login, password, first_name, last_name, wonGames, lostGames);
    }

    @RequestMapping(value = "/getUser", method = RequestMethod.POST, produces = "application/json")
    public String getUser(@RequestParam int id) {
        return bll.getUser(id);
    }

    @RequestMapping(value = "/updateUser", method = RequestMethod.GET, produces = "application/json")
    public String updateUser(
            @RequestParam int id,
            @RequestParam String password,
            @RequestParam String first_name,
            @RequestParam String last_name,
            @RequestParam int wonGames,
            @RequestParam int lostGames
    ) {
        return bll.updateUser(id, password, first_name, last_name, wonGames, lostGames);
    }

    @RequestMapping(value = "/searchUsers", method = RequestMethod.POST, produces = "application/json")
    public String searchUsers(@RequestParam String searchQuery) {
        return bll.searchUsers(searchQuery);
    }
}

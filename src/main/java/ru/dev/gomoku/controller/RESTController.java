package ru.dev.gomoku.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.dev.gomoku.BLL.BLL;


@RestController
public class RESTController {

    private final BLL bll;

    public RESTController(BLL bll) {
        this.bll = bll;
    }

    @RequestMapping(value = "/authorization", method = RequestMethod.POST, produces = "application/json")
    public String authorization(@RequestParam String login, @RequestParam String password) {
        return bll.authorization(login, password);
    }

    //@RequestMapping - используется для установления URL, метода передачи данных (ГЕТ или ПОСТ)
    //produces - формат данных, которым отвечает сервер
    @RequestMapping(value = "/emailAlreadyExists", method = RequestMethod.POST, produces = "application/json")
    public String emailAlreadyExists(@RequestParam String email) {
        return bll.emailAlreadyExists(email);
    }

    @RequestMapping(value = "/loginAlreadyExists", method = RequestMethod.POST, produces = "application/json")
    public String loginAlreadyExists(@RequestParam String login) {
        return bll.loginAlreadyExists(login);
    }

    @RequestMapping(value = "/setUser", method = RequestMethod.POST, produces = "application/json")
    public String setUser(
            @RequestParam String email,
            @RequestParam String login,
            @RequestParam String password,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam int wonGames,
            @RequestParam int lostGames) {
        return bll.setUser(email, login, password, firstName, lastName, wonGames, lostGames);
    }

    @RequestMapping(value = "/getUser", method = RequestMethod.POST, produces = "application/json")
    public String getUser(@RequestParam int id) {
        return bll.getUser(id);
    }

    @RequestMapping(value = "/getFriends", method = RequestMethod.POST, produces = "application/json")
    public String getFriends(@RequestParam int id) {
        return bll.getFriends(id);
    }

    @RequestMapping(value = "/updateUser", method = RequestMethod.POST, produces = "application/json")
    public String updateUser(
            @RequestParam int id,
            @RequestParam String password,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam int wonGames,
            @RequestParam int lostGames
    ) {
        return bll.updateUser(id, password, firstName, lastName, wonGames, lostGames);
    }

    @RequestMapping(value = "/searchUsers", method = RequestMethod.POST, produces = "application/json")
    public String searchUsers(@RequestParam String searchQuery) {
        return bll.searchUsers(searchQuery);
    }

    @RequestMapping(value = "/getFreeGames", method = RequestMethod.POST, produces = "application/json")
    public String getFreeGames() {
        return bll.getFreeGames();
    }

    @RequestMapping(value = "/getGame", method = RequestMethod.POST, produces = "application/json")
    public String getGame(@RequestParam int id) {
        return bll.getGame(id);
    }

    @RequestMapping(value = "/createGame", method = RequestMethod.POST, produces = "application/json")
    public String createGame(@RequestParam int userId) {
        return bll.createGame(userId);
    }

    @RequestMapping(value = "/joinGame", method = RequestMethod.POST, produces = "application/json")
    public String joinGame(@RequestParam int userId, @RequestParam int gameId) {
        return bll.joinGame(userId, gameId);
    }

    @RequestMapping(value = "/changeGameState", method = RequestMethod.POST, produces = "application/json")
    public String changeGameState(@RequestParam int id, @RequestParam String gameState) {
        return bll.changeGameState(id, gameState);
    }

    @RequestMapping(value = "/addFriend", method = RequestMethod.POST, produces = "application/json")
    public String addFriend(
            @RequestParam int meId,
            @RequestParam int friendId
    ) {
        return bll.setFriend(meId, friendId);
    }

    @RequestMapping(value = "/deleteFriend", method = RequestMethod.POST, produces = "application/json")
    public String deleteFriend(
            @RequestParam int meId,
            @RequestParam int friendId
    ) {
        return bll.deleteFriend(meId, friendId);
    }

    @RequestMapping(value = "/setWinner", method = RequestMethod.POST, produces = "application/json")
    public String setWinner(
            @RequestParam int gameId,
            @RequestParam int winnerId
    ) {
        return bll.setWinner(gameId, winnerId);
    }
}

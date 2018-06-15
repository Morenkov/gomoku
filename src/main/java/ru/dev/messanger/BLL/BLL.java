package ru.dev.messanger.BLL;

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ru.dev.messanger.dll.Database;
import ru.dev.messanger.entities.*;

import java.time.Instant;
import java.util.HashMap;

@Service
public class BLL {

    @Value("${upload.path}")
    private String uploadPath;

    @Value("${image.profile.path}")
    private String uploadProfilePath;

    private HashMap<Object, Token> userToken = new HashMap<>(); //Key(Object) is ID of User

    public HashMap<Object, Token> getUserToken() {
        return userToken;
    }

    public void addTokenToUser(TUser user, Token token) {
        this.userToken.put(user.getId(), token);
    }

    public Boolean checkToken(String token) {
        if ((token == null) || (userToken.size() == 0) || (token.isEmpty())) {
            return false;
        }
        Token storedToken = getToken(token);
        if (storedToken != null) {
            if (storedToken.getExpires().compareTo(Instant.now()) >= 0) {
                storedToken.setExpires(Instant.now().plusSeconds(Token.LIFETIME));
                return true;
            } else {
                removeToken(storedToken);
                return false;
            }
        } else {
            return false;
        }
    }

    private Token getToken(String token) {
        for (Object key : userToken.keySet()) {
            if (token.equals(userToken.get(key).getStringToken())) {
                return userToken.get(key);
            }
        }
        return null;
    }

    public int getUserIdByToken(String token) {
        for (Object key : userToken.keySet()) {
            if (token.equals(userToken.get(key).getStringToken())) {
                return (int) key;
            }
        }
        return -1;
    }

    public Boolean removeToken(Token token) {
        if (userToken.containsValue(token)) {
            for (Object key : userToken.keySet()) {
                if (userToken.get(key) == token) {
                    userToken.remove(key);
                    return true; //Tokens are unique, no need to continue iteration
                }
            }
        }
        return false;
    }

    public Boolean removeToken(String token) {
        for (Object key : userToken.keySet()) {
            if (token.equals(userToken.get(key).getStringToken())) {
                userToken.remove(key);
                return true; //Tokens are unique, no need to continue iteration
            }
        }
        return false;
    }

    public String authorization(String login, String password) {
        if (loginAlreadyExists(login) == "false") {
            return new Gson().toJson("No Such User"); //TODO: связана с ранним запросом ДО авторизации loginaleready exists И НЕ ТЕСТИТСЯ ИБО НИКАК чина давай
        }

        UserDTO user = Database.INSTANCE.authorization(login, Encoder.hash256(password));
        if (user == null) {
            return new Gson().toJson("Incorrect password");
        }
        Token tkn = new Token();
        TUser tuser = new TUser(user, tkn.getStringToken());
        addTokenToUser(tuser, tkn);
        return new Gson().toJson(tuser);
    }

    public String emailAlreadyExists(String email) {
        return new Gson().toJson(Database.INSTANCE.emailAlreadyExists(email));
    }

    public String loginAlreadyExists(String login) {
        return new Gson().toJson(Database.INSTANCE.loginAlreadyExists(login));
    }

    public String setUser(
            String email,
            String login,
            String password,
            String first_name,
            String last_name,
            int wonGames,
            int lostGames) {
        NewUserDTO user = new NewUserDTO();
        user.setEmail(email);
        user.setLogin(login);
        user.setPassword(Encoder.hash256(password));
        user.setFirstName(first_name);
        user.setLastName(last_name);
        user.setWonGames(wonGames);
        user.setLostGames(lostGames);

        return new Gson().toJson(Database.INSTANCE.setUser(user));
    }

    public String getUser(int id) {
        return new Gson().toJson(Database.INSTANCE.getUser(id));
    }

    public String getFriends(int id) {
        return new Gson().toJson(Database.INSTANCE.getFriends(id));
    }

    public String updateUser(
            int id,
            String password,
            String first_name,
            String last_name,
            int wonGames,
            int lostGames
    ) {
        NewUserDTO user = new NewUserDTO();
        user.setId(id);
        user.setPassword(Encoder.hash256(password));
        user.setFirstName(first_name);
        user.setLastName(last_name);
        user.setWonGames(wonGames);
        user.setLostGames(lostGames);

        return new Gson().toJson(Database.INSTANCE.updateUser(user, id));
    }

    public String searchUsers(
            String searchQuery
    ) {
        if (!StringUtils.isEmpty(searchQuery)) {
            return new Gson().toJson(Database.INSTANCE.searchUsers(searchQuery));
        }
        return "Bad Query";
    }

    public String setFriend(int meId, int friendId) {
        return new Gson().toJson(Database.INSTANCE.setFriend(meId, friendId));
    }

    public String joinGame(int userId, int gameId) {
        return new Gson().toJson(Database.INSTANCE.joinGame(userId, gameId));
    }

    public String setWinner(int gameId, int winnerId) {
        return new Gson().toJson(Database.INSTANCE.joinGame(gameId, winnerId));
    }

    public String changeGameState(int id, String friendId) {
        return new Gson().toJson(Database.INSTANCE.changeGameState(id, friendId));
    }

    public String getGame(int id) {
        return new Gson().toJson(Database.INSTANCE.getGame(id));
    }

    public String getFreeGames() {
        return new Gson().toJson(Database.INSTANCE.getFreeGames());
    }

    public String createGame(int userId) {
        return new Gson().toJson(Database.INSTANCE.createGame(userId));
    }
}

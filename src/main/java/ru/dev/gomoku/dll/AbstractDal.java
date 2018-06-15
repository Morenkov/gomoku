package ru.dev.gomoku.dll;

import ru.dev.gomoku.entities.*;
import ru.dev.gomoku.entities.UserDTO;

public interface AbstractDal {
    UserDTO authorization(String login, String password);
    Boolean emailAlreadyExists(String email);
    Boolean loginAlreadyExists(String login);
    Boolean setUser(NewUserDTO item);
    UserDTO getUser(int id);
    GameDTO getGame(int id);
    Iterable<UserDTO> getFriends(int id);
    Boolean setFriend(int meId, int friendId);
    Boolean updateUser(NewUserDTO item, Integer id);
    Iterable<UserDTO> searchUsers(String searchQuery);
    Iterable<GameDTO> getFreeGames();
    Boolean changeGameState(int gameId, String gameState);
    Boolean joinGame(int userId, int gameId);
    GameDTO createGame(int userId);
    Boolean setWinner(int gameId, int winnerId);
    Boolean deleteFriend(int meId, int friendId);
}

package ru.dev.gomoku.entities;

import com.google.gson.annotations.SerializedName;

public class TUser extends NewUserDTO {

    @SerializedName("token")
    private String token;

    public TUser(UserDTO user, String tkn) {
        setId(user.getId());
        setLogin(user.getLogin());
        setEmail(user.getEmail());
        setFirstName(user.getFirstName());
        setLastName(user.getLastName());
        setWonGames(user.getWonGames());
        setLostGames(user.getLostGames());

        this.token = tkn;
    }

    public String getToken() {
        return this.token;
    }
}

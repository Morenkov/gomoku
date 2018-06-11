package ru.dev.messanger.entities;

import com.google.gson.annotations.SerializedName;
import ru.dev.messanger.BLL.BLL;

public class TUser extends NewUserDTO {

    @SerializedName("token")
    private String token;

    public TUser(UserDTO user, String tkn) {
        setId(user.getId());
        setLogin(user.getLogin());
        setEmail(user.getEmail());
        setFirstName(user.getFirstName());
        setLastName(user.getLastName());

        this.token = tkn;
    }

    public String getToken() {
        return this.token;
    }
}

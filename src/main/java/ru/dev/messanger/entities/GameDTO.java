package ru.dev.messanger.entities;

import com.google.gson.annotations.SerializedName;

public class GameDTO {
    @SerializedName("id")
    private int id;
    @SerializedName("secondPlayerId")
    private int secondPlayerId;
    @SerializedName("firstPlayerId")
    private int firstPlayerId;
    @SerializedName("gameState")
    private String gameState;
    @SerializedName("wonId")
    private int wonId;
    @SerializedName("opponentName")
    private String opponentName;
    @SerializedName("opponentSurname")
    private String opponentSurname;

    public String getOpponentName() {
        return opponentName;
    }

    public void setOpponentName(String opponentName) {
        this.opponentName = opponentName;
    }

    public String getOpponentSurname() {
        return opponentSurname;
    }

    public void setOpponentSurname(String opponentSurname) {
        this.opponentSurname = opponentSurname;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSecondPlayerId() {
        return secondPlayerId;
    }

    public void setSecondPlayerId(int secondPlayerId) {
        this.secondPlayerId = secondPlayerId;
    }

    public int getFirstPlayerId() {
        return firstPlayerId;
    }

    public void setFirstPlayerId(int firstPlayerId) {
        this.firstPlayerId = firstPlayerId;
    }

    public String getGameState() {
        return gameState;
    }

    public void setGameState(String gameState) {
        this.gameState = gameState;
    }

    public int getWonId() {
        return wonId;
    }

    public void setWonId(int wonId) {
        this.wonId = wonId;
    }
}

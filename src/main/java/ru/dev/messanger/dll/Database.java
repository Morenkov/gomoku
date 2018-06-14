package ru.dev.messanger.dll;

import ru.dev.messanger.entities.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class Database implements AbstractDal {

    private Properties properties;
    private String url;

    public static final Database INSTANCE = new Database();

    public Database() {
        properties = new Properties();
        properties.setProperty("url", "jdbc:mariadb://localhost:3306/gomoku?useUnicode=yes&characterEncoding=UTF-8");
        properties.setProperty("jdbc.driver", "org.mariadb.jdbc.Driver");
        properties.setProperty("user", "root");
        properties.setProperty("password", "root");

        url = "jdbc:mariadb://localhost:3306/gomoku?useUnicode=yes&characterEncoding=UTF-8";

        try {
            Class.forName("org.mariadb.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("Driver not found.");
            e.printStackTrace();
        }
    }

    @Override
    public UserDTO authorization(String login, String password) {
        UserDTO user = null;
        try (Connection connection = DriverManager.getConnection(properties.getProperty("url"), properties)) {
            String SqlQuery = "SELECT users.id, email, login, users.name, surname, `won-games`, `lost-games` FROM users  " +
                    "WHERE (login='" + login + "' OR email='" + login + "') AND password='" + password + "';";
            try (PreparedStatement st = connection.prepareStatement(SqlQuery)) {
                st.executeQuery();
                try (ResultSet rs = st.getResultSet()) {
                    user = new UserDTO();
                    while (rs.next()) {
                        user = getAUser(rs);
                    }
                }
            }
        } catch (SQLException e) {
            System.out.println("Connection problem.");
            e.printStackTrace();
        }
        if (user != null && user.getId() == 0) {
            return null;
        }
        return user;
    }

    @Override
    public Boolean emailAlreadyExists(String email) {
        try (Connection connection = DriverManager.getConnection(properties.getProperty("url"), properties)) {
            String SqlQuery = "SELECT  COUNT(id) FROM users WHERE email='" + email + "'";
            try (PreparedStatement st = connection.prepareStatement(SqlQuery)) {
                st.executeQuery();
                try (ResultSet rs = st.getResultSet()) {
                    while (rs.next()) {
                        if (rs.getInt(1) > 0) {
                            return true;
                        }
                    }
                }
            }
        } catch (SQLException e) {
            System.out.println("Connection problem.");
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public Boolean loginAlreadyExists(String login) {
        try (Connection connection = DriverManager.getConnection(properties.getProperty("url"), properties)) {
            String SqlQuery = "SELECT COUNT (id) FROM users WHERE login='" + login + "'";
            try (PreparedStatement st = connection.prepareStatement(SqlQuery)) {
                st.executeQuery();
                try (ResultSet rs = st.getResultSet()) {
                    while (rs.next()) {
                        if (rs.getInt(1) > 0) {
                            return true;
                        }
                    }
                }
            }
        } catch (SQLException e) {
            System.out.println("Connection problem.");
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public Boolean setUser(NewUserDTO item) {
        try (Connection connection = DriverManager.getConnection(properties.getProperty("url"), properties)) {
            String SqlQuery = "INSERT INTO users (email, login, password, users.name, surname, `won-games`, `lost-games`) " +
                    "VALUES ('" + item.getEmail() + "', '" + item.getLogin() + "', '" + item.getPassword() + "', '" + item.getFirstName() + "', '" + item.getLastName() +
                    "', '" + item.getWonGames() + "', '" + item.getLostGames() + "');";
            try (PreparedStatement st = connection.prepareStatement(SqlQuery)) {
                st.executeQuery();
            } catch (SQLException e) {
                return false;
            }
        } catch (SQLException e) {
            System.out.println("Connection problem.");
            e.printStackTrace();
        }
        return true;
    }

    @Override
    public Boolean setFriend(int meId, int friendId) {
        try (Connection connection = DriverManager.getConnection(properties.getProperty("url"), properties)) {
            String SqlQuery = "INSERT INTO friends (`first-id`, `second-id`) " +
                    "VALUES ('" + meId + "', '" + friendId + "');";
            try (PreparedStatement st = connection.prepareStatement(SqlQuery)) {
                st.executeQuery();
            } catch (SQLException e) {
                return false;
            }
        } catch (SQLException e) {
            System.out.println("Connection problem.");
            e.printStackTrace();
        }
        return true;
    }

    @Override
    public UserDTO getUser(int id) {
        UserDTO user = null;
        try (Connection connection = DriverManager.getConnection(properties.getProperty("url"), properties)) {
            String SqlQuery = "SELECT users.id, email, login, users.name, surname, `won-games`, `lost-games` FROM users " +
                    "WHERE users.id=" + id;
            try (PreparedStatement st = connection.prepareStatement(SqlQuery)) {
                st.executeQuery();
                try (ResultSet rs = st.getResultSet()) {
                    while (rs.next()) {
                        user = getUser(rs);
                    }
                }
            }
        } catch (SQLException e) {
            System.out.println("Connection problem.");
            e.printStackTrace();
        }

        return user;
    }

    @Override
    public GameDTO getGame(int id) {
        GameDTO game = null;
        try (Connection connection = DriverManager.getConnection(properties.getProperty("url"), properties)) {
            String SqlQuery = "SELECT games.id, `first-player-id`, `second-player-id`, gamestate, `winner-id` FROM games " +
                    "WHERE games.id=" + id;
            try (PreparedStatement st = connection.prepareStatement(SqlQuery)) {
                st.executeQuery();
                try (ResultSet rs = st.getResultSet()) {
                    while (rs.next()) {
                        game = getGame(rs);
                    }
                }
            }
        } catch (SQLException e) {
            System.out.println("Connection problem.");
            e.printStackTrace();
        }

        return game;
    }

    @Override
    public Boolean updateUser(NewUserDTO item, Integer id) {
        try (Connection connection = DriverManager.getConnection(properties.getProperty("url"), properties)) {
            String SqlQuery = "UPDATE users " +
                    "SET password='" + item.getPassword() + "', users.name='" + item.getFirstName() + "', surname='" + item.getLastName() +
                    "', `won-games`='" + item.getWonGames() + "', `lost-games`='" + item.getLostGames() +
                    "' WHERE users.id='" + id + "';";
            try (PreparedStatement st = connection.prepareStatement(SqlQuery)) {
                st.executeQuery();
            } catch (SQLException e) {
                return false;
            }
        } catch (SQLException e) {
            System.out.println("Connection problem.");
            e.printStackTrace();
        }
        return true;
    }

    @Override
    public Iterable<UserDTO> searchUsers(String searchQuery) {
        List<UserDTO> users = null;
        try (Connection connection = DriverManager.getConnection(properties.getProperty("url"), properties)) {
            String SqlQuery = "SELECT users.id, email, login, users.name, surname, `won-games`, `lost-games` " +
                    "FROM users WHERE login LIKE '%" + searchQuery + "%'";
            try (PreparedStatement st = connection.prepareStatement(SqlQuery)) {
                st.executeQuery();
                try (ResultSet rs = st.getResultSet()) { //Что получаем
                    users = new ArrayList<>();
                    while (rs.next()) {
                        users.add(getUser(rs));
                    }
                }
            }
        } catch (SQLException e) {
            System.out.println("Connection problem.");
            e.printStackTrace();
        }
        return users;
    }

    @Override
    public Iterable<UserDTO> getFriends(int id) {
        List<UserDTO> users = new ArrayList<>();;
        try (Connection connection = DriverManager.getConnection(properties.getProperty("url"), properties)) {
            String SqlQuery = "SELECT users.id, email, login, users.name, surname, `won-games`, `lost-games` " +
                    "FROM friends LEFT JOIN users ON users.id=friends.`second-id` " +
                    "WHERE friends.`first-id` =" + id;
            try (PreparedStatement st = connection.prepareStatement(SqlQuery)) {
                st.executeQuery();
                try (ResultSet rs = st.getResultSet()) {
                    while (rs.next()) {
                        users.add(getUser(rs));
                    }
                }
            }

            SqlQuery = "SELECT users.id, email, login, users.name, surname, `won-games`, `lost-games` " +
                    "FROM friends LEFT JOIN users ON users.id=friends.`first-id` " +
                    "WHERE friends.`second-id` =" + id;
            try (PreparedStatement st = connection.prepareStatement(SqlQuery)) {
                st.executeQuery();
                try (ResultSet rs = st.getResultSet()) {
                    while (rs.next()) {
                        users.add(getUser(rs));
                    }
                }
            }
        } catch (SQLException e) {
            System.out.println("Connection problem.");
            e.printStackTrace();
        }
        return users;
    }

    private static UserDTO getAUser(ResultSet rs) throws SQLException {
        UserDTO user = new UserDTO();
        user.setId(rs.getInt(1));
        user.setEmail(rs.getString(2));
        user.setLogin(rs.getString(3));
        user.setFirstName(rs.getString(4));
        user.setLastName(rs.getString(5));

        return user;
    }

    private static UserDTO getUser(ResultSet rs) throws SQLException {
        UserDTO user = new UserDTO();
        user.setId(rs.getInt(1));
        user.setEmail(rs.getString(2));
        user.setLogin(rs.getString(3));
        user.setFirstName(rs.getString(4));
        user.setLastName(rs.getString(5));
        user.setWonGames(rs.getInt(6));
        user.setLostGames(rs.getInt(6));
        return user;
    }

    private static NewUserDTO getFullUser(ResultSet rs) throws SQLException {
        NewUserDTO user = new NewUserDTO();
        user.setId(rs.getInt(1));
        user.setEmail(rs.getString(2));
        user.setLogin(rs.getString(3));
        user.setPassword(rs.getString(4));
        user.setFirstName(rs.getString(5));
        user.setLastName(rs.getString(6));
        user.setWonGames(rs.getInt(7));
        user.setLostGames(rs.getInt(8));
        return user;
    }

    private static GameDTO getGame(ResultSet rs) throws SQLException {
        GameDTO game = new GameDTO();
        game.setId(rs.getInt(1));
        game.setFirstPlayerId(rs.getInt(2));
        game.setSecondPlayerId(rs.getInt(3));
        game.setGameState(rs.getString(4));
        game.setWonId(rs.getInt(5));
        return game;
    }
}
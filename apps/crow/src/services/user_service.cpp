#include "user_service.hpp"

UserService::UserService(Database& database)
    : db(database)
{
}

std::vector<User> UserService::getAll()
{
    std::vector<User> users;

    pqxx::work transaction(db.connection());

    auto result = transaction.exec(
        "SELECT id, name, email "
        "FROM users "
        "ORDER BY id"
    );

    for (const auto& row : result)
    {
        User user;

        user.id = row["id"].as<int>();
        user.name = row["name"].as<std::string>();
        user.email = row["email"].as<std::string>();

        users.push_back(user);
    }

    transaction.commit();

    return users;
}

std::optional<User> UserService::getById(int id)
{
    pqxx::work transaction(db.connection());

    auto result = transaction.exec_params(
        "SELECT id, name, email "
        "FROM users "
        "WHERE id = $1",
        id
    );

    transaction.commit();

    if (result.empty())
    {
        return std::nullopt;
    }

    const auto& row = result[0];

    return User{
        row["id"].as<int>(),
        row["name"].as<std::string>(),
        row["email"].as<std::string>()
    };
}

User UserService::create(
    const std::string& name,
    const std::string& email
)
{
    pqxx::work transaction(db.connection());

    auto result = transaction.exec_params(
        "INSERT INTO users (name, email) "
        "VALUES ($1, $2) "
        "RETURNING id, name, email",
        name,
        email
    );

    transaction.commit();

    const auto& row = result[0];

    return User{
        row["id"].as<int>(),
        row["name"].as<std::string>(),
        row["email"].as<std::string>()
    };
}

bool UserService::remove(int id)
{
    pqxx::work transaction(db.connection());

    auto result = transaction.exec_params(
        "DELETE FROM users WHERE id = $1",
        id
    );

    transaction.commit();

    return result.affected_rows() > 0;
}
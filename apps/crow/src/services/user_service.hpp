#pragma once

#include "../db.hpp"
#include "../models/user.hpp"

#include <vector>
#include <optional>

class UserService
{
public:
    explicit UserService(Database& database);

    std::vector<User> getAll();

    std::optional<User> getById(int id);

    User create(
        const std::string& name,
        const std::string& email
    );

    bool remove(int id);

private:
    Database& db;
};
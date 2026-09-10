#pragma once

#include <pqxx/pqxx>
#include <memory>
#include <string>

class Database
{
public:
    explicit Database(const std::string& connectionString);

    pqxx::connection& connection();

private:
    std::unique_ptr<pqxx::connection> conn;
};
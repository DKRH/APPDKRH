#include "db.hpp"

Database::Database(const std::string& connectionString)
{
    conn = std::make_unique<pqxx::connection>(connectionString);

    if (!conn->is_open())
    {
        throw std::runtime_error("Failed to connect to PostgreSQL");
    }
}

pqxx::connection& Database::connection()
{
    return *conn;
}
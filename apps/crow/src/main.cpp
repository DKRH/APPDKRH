#include <crow.h>

#include "db.hpp"
#include "services/user_service.hpp"
#include "routes/users.hpp"

#include <cstdlib>
#include <iostream>

int main()
{
    try
    {
        const char* databaseUrl =
            std::getenv("CPP_DATABASE_URL");

        if (!databaseUrl)
        {
            throw std::runtime_error(
                "CPP_DATABASE_URL is not set"
            );
        }

        Database database(databaseUrl);

        UserService userService(database);

        crow::SimpleApp app;

        CROW_ROUTE(app, "/health")
        ([]()
        {
            return crow::response{
                crow::json::wvalue{
                    {"status", "ok"},
                    {"service", "cpp-crow"}
                }
            };
        });

        registerUserRoutes(
            app,
            userService
        );

        std::cout << "C++ Crow API running on port 2605\n";

        const char* portEnv = std::getenv("CPP_PORT");

        int port = portEnv ? std::stoi(portEnv) : 2607;

        app.port(port).multithreaded().run();
    }
    catch (const std::exception& e)
    {
        std::cerr
            << "Fatal error: "
            << e.what()
            << '\n';

        return 1;
    }

    return 0;
}
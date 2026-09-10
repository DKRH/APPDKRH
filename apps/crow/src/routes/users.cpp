#include "users.hpp"

void registerUserRoutes(
    crow::SimpleApp& app,
    UserService& userService
)
{
    // GET /api/users
    CROW_ROUTE(app, "/api/users")
    ([&userService]()
    {
        auto users = userService.getAll();

        crow::json::wvalue response =
            crow::json::wvalue::list({});

        int index = 0;

        for (const auto& user : users)
        {
            response[index++] = {
                {"id", user.id},
                {"name", user.name},
                {"email", user.email}
            };
        }

        return crow::response{response};
    });


    // GET /api/users/:id
    CROW_ROUTE(app, "/api/users/<int>")
    ([&userService](int id)
    {
        auto user = userService.getById(id);

        if (!user)
        {
            return crow::response(
                404,
                "User not found"
            );
        }

        crow::json::wvalue response{
            {"id", user->id},
            {"name", user->name},
            {"email", user->email}
        };

        return crow::response{response};
    });


    // POST /api/users
    CROW_ROUTE(app, "/api/users")
        .methods(crow::HTTPMethod::POST)
    ([&userService](const crow::request& req)
    {
        auto body = crow::json::load(req.body);

        if (!body)
        {
            return crow::response(
                400,
                "Invalid JSON"
            );
        }

        if (!body.has("name") || !body.has("email"))
        {
            return crow::response(
                400,
                "name and email are required"
            );
        }

        std::string name =
            body["name"].s();

        std::string email =
            body["email"].s();

        auto user =
            userService.create(name, email);

        crow::json::wvalue response{
            {"id", user.id},
            {"name", user.name},
            {"email", user.email}
        };

        return crow::response{
            201,
            response
        };
    });


    // DELETE /api/users/:id
    CROW_ROUTE(app, "/api/users/<int>")
        .methods(crow::HTTPMethod::DELETE)
    ([&userService](int id)
    {
        bool deleted =
            userService.remove(id);

        if (!deleted)
        {
            return crow::response(
                404,
                "User not found"
            );
        }

        return crow::response{
            200,
            "User deleted"
        };
    });
}
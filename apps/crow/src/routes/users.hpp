#pragma once

#include <crow.h>
#include "../services/user_service.hpp"

void registerUserRoutes(
    crow::SimpleApp& app,
    UserService& userService
);
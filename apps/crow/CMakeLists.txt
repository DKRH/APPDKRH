cmake_minimum_required(VERSION 3.20)

project(serverCrow)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Crow CONFIG REQUIRED)

add_executable(serverCrow
    src/main.cpp
)

target_link_libraries(serverCrow
    PRIVATE Crow::Crow
)
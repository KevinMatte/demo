
cmake_minimum_required(VERSION 3.10)
project(demo_cpp  LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
  crow
  GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
  GIT_TAG v1.2.1.2
)
FetchContent_MakeAvailable(crow)

include(FetchContent)

FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.12.0
)
FetchContent_MakeAvailable(json)

add_executable(demo_cpp src/main.cpp)
target_link_libraries(demo_cpp PRIVATE Crow::Crow nlohmann_json::nlohmann_json)

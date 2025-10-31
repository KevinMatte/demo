#include "crow.h"
#include <cstdlib>
#include <nlohmann/json.hpp>
using json = nlohmann::json;



int main()
{
    crow::SimpleApp app;

    /*
        curl localhost:8080
     */
    CROW_ROUTE(app, "/")([](){
        return "Hello, world!";
    });

    /*
        curl localhost:8080/add/5/90
     */
    CROW_ROUTE(app, "/add/<int>/<int>")([](int a, int b){
        return crow::response(std::to_string(a + b));
    });

    /*
        curl -X POST -H "Content-Type: application/json" \
             -d '{"username":"admin","password":"admin"}' \
             localhost:8080/api/echo
     */
    CROW_ROUTE(app, "/api/echo").methods("POST"_method)
        ([](const crow::request& req){
            try {
                auto body = json::parse(req.body);
                json response = {{"status", "ok"}, {"received", body}};
                return crow::response{response.dump()};
            } catch (...) {
                return crow::response{400, "Invalid JSON"};
            }
        });

    char *strPort = std::getenv("DEMO_CPP_PORT");
    int port = strPort ? std::stoi(strPort) : 8080;
    std::cout << "Listening on port " << port << "\n";
    std::cout.flush();
    app.port(port).multithreaded().run();
    std::cout << "Finished run\n";
    std::cout.flush();
    exit(0);
}



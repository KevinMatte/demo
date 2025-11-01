#include "crow.h"
#include <cstdlib>
#include <nlohmann/json.hpp>
#include <string>
using json = nlohmann::json;

class MainApp;
MainApp *main_app;

class MainApp {

private:
    crow::SimpleApp app;
    bool byPassCORS = false;

    static json get_api_add(int a, int b) {
        json response = {
            {"status", "ok"},          {"add", a + b},
            {"delete", a - b},         {"multiply", a * b},
            {"divide", b ? a / b : 0},
    };
        if (b == 0) {
            response["status"] = "warning";
            response["message"] = "Partial Results: Cannot divide by 0";
            const char *fields[] = {"divide"};
            response["fields"] = fields;
        }

        return response;
    }

    crow::response return_response(std::string str) {
        crow::response response(str);
        response.add_header("Cache-Control", "content=\"no-cache, no-store, must-revalidate\"");
        if (byPassCORS)
            response.add_header("Access-Control-Allow-Origin", "*");

        return response;
    }

    crow::response return_json(json &data) {
        return return_response(data.dump());
    }

    crow::response failed_response(std::string message) {
        json response = {
            {"status", "failed"},
            {"message", message},
            };
        return return_json(response);
    }

    void setup_routes() {

        /* curl localhost:8080 */
        CROW_ROUTE(app, "/")([]() { return main_app->return_response("Hello, world!"); });

        /* curl localhost:8080/add/5/90 */
        CROW_ROUTE(app, "/api/math/ops_a_b/<int>/<int>")
        ([](int a, int b) {
            json response = get_api_add(a, b);

            return main_app->return_json(response);
        });

        /*
curl -X POST -H "Content-Type: application/json" \
-d '{"username":"admin","password":"admin"}' \
localhost:8080/api/echo
*/
        CROW_ROUTE(app, "/api/math/ops_a_b")
            .methods("POST"_method)([](const crow::request &req) {
                try {
                    auto body = json::parse(req.body);
                    int a, b;
                    try {
                        a = body["a"];
                    } catch (...) {
                        return main_app->failed_response("'a' must be an integer");
                    }
                    try {
                        b = body["b"];
                    } catch (...) {
                        return main_app->failed_response("'b' must be an integer");
                    }

                    json response = get_api_add(a, b);

                    return main_app->return_json(response);
                } catch (...) {
                    return main_app->failed_response("Invalid JSON");
                }
            });
    }

public:
    int main() {
        setup_routes();

        int port = 8080;

        try {
            char *strPort = std::getenv("DEMO_CPP_PORT");
            port = (strPort && strlen(strPort)) ? std::stoi(strPort) : 8080;
        } catch (...) {
            ;
        }

        try {
            char *strByPassCORS = std::getenv("NO_CORS");
            byPassCORS = (strByPassCORS == NULL) || (strcmp(strByPassCORS, "1") == 0);
        } catch (...) {
            ;
        }
        if (byPassCORS)
            std::cout << (byPassCORS ? "Bypassing CORS.\n" : "NOT Bypassing CORS.\n");


        std::cout << "Listening on port " << port << "\n";
        std::cout.flush();
        app.port(port).multithreaded().run();
        std::cout << "Finished run\n";
        std::cout.flush();

    return 0;
    }
};

int main() {
    main_app = new MainApp();
    return main_app->main();
}

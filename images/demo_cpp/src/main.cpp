#include "crow.h"
#include <cstdlib>
#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;

class MainApp;

MainApp *mainApp;

double getDouble(json::reference &reference, bool &failed);

class MainApp {

private:
    crow::SimpleApp app;
    bool byPassCORS = false;

    static json getApiMath(double fOp1, double fOp2) {
        double fDivResult = (fOp2 != 0) ? fOp1 / fOp2 : 0;
        std::stringstream ssDivResult;
        ssDivResult << std::fixed << std::setprecision(4) << fDivResult;

        json response = {
                {"status",   "ok"},
                {"add",      fOp1 + fOp2},
                {"delete",   fOp1 - fOp2},
                {"multiply", fOp1 * fOp2},
                {"divide",   ssDivResult.str()},
        };
        if (fOp2 == 0) {
            response["status"] = "warning";
            response["message"] = "Partial Results: Cannot divide by 0";
            const char *fields[] = {"divide"};
            response["fields"] = fields;
        }

        return response;
    }

    [[nodiscard]] crow::response returnResponse(const char *strBody) const {
        crow::response response(strBody);
        response.add_header("Content-Type", "application/json");
        response.add_header("Cache-Control", "content=\"no-cache, no-store, must-revalidate\"");
        if (byPassCORS)
            response.add_header("Access-Control-Allow-Origin", "*");

        return response;
    }

    crow::response returnJson(json &jsonBody) {
        return returnResponse(jsonBody.dump().c_str());
    }

    crow::response failedResponse(std::string strMessage) {
        json response = {
                {"status",  "failed"},
                {"message", strMessage},
        };
        return returnJson(response);
    }

    void setupRoutes() {

        /* curl localhost:8080 */
        CROW_ROUTE(app, "/")([]() { return mainApp->returnResponse("Hello, world!"); });

        /* curl localhost:8080/add/5/90 */
        CROW_ROUTE(app, "/api/math/ops_a_b/<double>/<double>")
                ([](double fOp1, double fOp2) {
                    json response = getApiMath(fOp1, fOp2);

                    return mainApp->returnJson(response);
                });

        /*
curl -X POST -H "Content-Type: application/json" \
-d '{"username":"admin","password":"admin"}' \
localhost:8080/api/echo
*/
        CROW_ROUTE(app, "/api/math/ops_a_b")
                .methods("POST"_method)([](const crow::request &req) {
                    try {
                        auto jsonBody = json::parse(req.body);

                        // Get Operands 1 and 2.
                        double fOp1, fOp2;
                        bool failed = false;
                        fOp1 = getDouble(jsonBody["op1"], failed);
                        fOp2 = getDouble(jsonBody["op2"], failed);
                        if (failed)
                            return mainApp->failedResponse("ERROR: Operands not parsed as doubles.");

                        json response = getApiMath(fOp1, fOp2);

                        return mainApp->returnJson(response);
                    } catch (...) {
                        return mainApp->failedResponse("Invalid JSON");
                    }
                });
    }

public:
    int main() {
        setupRoutes();

        // Get port to listen on. Default is 8080.
        int port;
        char *strPort = std::getenv("DEMO_CPP_PORT");
        try {
            port = (strPort && strlen(strPort)) ? std::stoi(strPort) : 8080;
        } catch (...) {
            port = 8080;
        }

        // If NO_CORS=1, all response headers include "Access-Control-Allow-Origin", "*"
        try {
            char *strByPassCORS = std::getenv("NO_CORS");
            byPassCORS = (strByPassCORS == nullptr) || (strcmp(strByPassCORS, "1") == 0);
        } catch (...) { }
         std::cout << (byPassCORS ? "Bypassing CORS.\n" : "NOT Bypassing CORS.\n");


        std::cout << "Listening on port " << port << "\n";
        std::cout.flush();
        app.port(port).multithreaded().run();
        std::cout << "Finished run\n";
        std::cout.flush();

        return 0;
    }
};

double getDouble(json::reference &reference, bool &failed) {
    float fOp1;

    try {
        if (reference.is_string())
            fOp1 = stof(reference.get<std::string>());
        else
            fOp1 = (double)reference.get<double>();
    } catch (...) {
        failed = true;
    }

    return fOp1;
}

int main() {
    mainApp = new MainApp();
    return mainApp->main();
}

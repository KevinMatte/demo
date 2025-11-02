#include "crow.h"
#include <cstdlib>
#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;

class MainApp;

MainApp *pMainApp = nullptr;

double getDouble(json::reference &reference, bool &failed);

class MainApp {

private:
    /** A microservice server. **/
    crow::SimpleApp app;

    /** If the environment variable NO_CORS is "1", CORS is disabled in all results. **/
    bool byPassCORS = false;

    /**
     * The one and only microservice implementation, besides returning "Hello World" on /.
     *
     * @param fOp1 Operand 1
     * @param fOp2 Operand 2
     * @return Returns a structure with +, -, * and / results.
     */
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

    /**
     * Creates a response with the common headers set.
     *
     * @param strBody The text to return as a JSON string.
     *
     * @return The microservice response.
     */
    [[nodiscard]] crow::response returnResponse(const char *strBody) const {
        crow::response response(strBody);
        response.add_header("Content-Type", "application/json");
        response.add_header("Cache-Control", "content=\"no-cache, no-store, must-revalidate\"");
        if (byPassCORS)
            response.add_header("Access-Control-Allow-Origin", "*");

        return response;
    }

    /**
     * Wraps #returnResponse to return crow::json instances.
     *
     * @param jsonBody The response content instationated as crow::json.
     * @return
     */
    crow::response returnJson(json &jsonBody) {
        return returnResponse(jsonBody.dump().c_str());
    }

    /**
     * Returns a standard failure response.
     * @param strMessage A message identifying the failure.
     * @return {"status": failed, "message" : strMessage}.
     */
    crow::response failedResponse(std::string strMessage) {
        json response = {
                {"status",  "failed"},
                {"message", strMessage},
        };
        return returnJson(response);
    }

    /**
     * Sets up the GET and POST route assignments.
     */
    void setupRoutes() {

        /* curl localhost:8080 */
        CROW_ROUTE(app, "/")([]() { return pMainApp->returnResponse("Hello, world!"); });

        /* Test: curl localhost:8080/add/5/90 */
        CROW_ROUTE(app, "/api/math/ops_a_b/<double>/<double>")
                ([](double fOp1, double fOp2) {
                    json response = getApiMath(fOp1, fOp2);

                    return pMainApp->returnJson(response);
                });

        /*
        Test: curl -X POST -H "Content-Type: application/json" \
                -d '{"op1":"1.5","op2":"0.5"}' \
                localhost:8080/api/math/ops_a_b
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
                            return pMainApp->failedResponse("ERROR: Operands not parsed as doubles.");

                        json response = getApiMath(fOp1, fOp2);

                        return pMainApp->returnJson(response);
                    } catch (...) {
                        return pMainApp->failedResponse("Invalid JSON");
                    }
                });
    }

public:

    /** main entry for program launched below in main() function. **/
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
        } catch (...) {}
        std::cout << (byPassCORS ? "Bypassing CORS.\n" : "NOT Bypassing CORS.\n");

        // Get up and running.
        std::cout << "Listening on port " << port << "\n";
        std::cout.flush();
        app.port(port).multithreaded().run();
        std::cout << "Finished run\n";
        std::cout.flush();

        return 0;
    }
};

double getDouble(json::reference &reference, bool &failed) {
    double fOp1;

    try {
        if (reference.is_string())
            fOp1 = stof(reference.get<std::string>());
        else
            fOp1 = reference.get<double>();
    } catch (...) {
        failed = true;
    }

    return fOp1;
}

int main() {
    pMainApp = new MainApp();
    return pMainApp->main();
}

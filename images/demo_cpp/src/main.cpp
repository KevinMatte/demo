// Necessary header files for input output functions
#include <iostream>
#include <fstream>
using namespace std;

// main() function: where the execution of
// C++ program begins
int main() {
    ofstream myfile;
    myfile.open("/tmp/kevin.txt");
    myfile << "This is xyz\n";
    myfile.close();

    cout << "Hello World\n";

    return 0;
}

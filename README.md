# Demo Project

__Hosted Websites__:
  * [http://184.64.118.116](http://184.64.118.116): Forwarded to Home Computer
  * [kevinmatte.xyz](https://kevinmatte.xyz/): My resume with a __Demo__ menu item that links to the above.
    * Hosted by: [HostPapa](https://www.hostpapa.ca/)
    * Content generated with: [WordPress](https://wordpress.com/)

__Project's tech-architecture so far__:

* __Project Framework and Source__: See git [demo project](https://github.com/KevinMatte/demo).
  * Docker container directories [images](images) may become subprojects when convenient and desirable.
* __Docker-Compose__: YAML and .env that are built with:
  * [Makefile](Makefile)
  * [bin/generateDotEnv.sh](bin/generateDotEnv.sh)
  * [bin/preprocessDockerCompose.py](bin/preprocessDockerCompose.py)
  * [src/docker-compose.yaml](src/docker-compose.yaml)
* __Docker Containers__:
  * [__demo_ui__](images/demo_ui): Hosting WebPages with: Apache2, WSGI, PHP, Python3  
  * [__demo_mariadb__](images/demo_mariadb): mariadb:11.8
  * [__demo_java__](images/demo_mariadb): Tomcat / Java Servlet
  * [__demo_cpp__](images/demo_cpp): With C++ using [Crow](https://github.com/CrowCpp/Crow) which is a fast and easy to use microframework for the web.
    * See [CMakeLists.txt](images/demo_cpp/CMakeLists.txt) for build details.
    * See [Crow API Reference](https://crowcpp.org/1.2.1/reference/index.html)
* __Development IDE's__:
  * [JetBrains IntelliJ IDEA](https://www.jetbrains.com/idea/): 
    Python, PHP, JavaScript, etc
  * [JetBrains CLion](https://www.jetbrains.com/clion/)
  * [Qt Creator](https://doc.qt.io/qtcreator/) community version: C++ and Non-Qt application.
* __OS Software Used__: See [installPackages.sh](bin/installPackages.sh)

## Implementation Notes:

Since this demo_ui is firstly for my own fun, the demo_ui manually builds with implementations that are already supported in
available frameworks. I started with an empty project, and incrementally added technology.

## Usage

### Initial Setup

* TODO: Test this...
* Install packages: [installPackages.sh](bin/installPackages.sh)
* Set passwords in .secrets.env
* Prevent .secrets.env from being committed: \
  `git update-index --assume-unchanged .secrets.env`
* Optional: Setup demo_prod in /etc/hosts

### New session for development/testing

* TODO: Test this...
* `make generateDotEnv`
* `make version_bump`
* `make localMounted`

## Development Base

* __Hosts__:
  * __demo_dev 1 and 2__: Development machines for all development activities.
  * __demo_prod__: A 24/7 running latest docker build.
* __Development Notes__:
  * __bin/initDevEnv.sh__: Manually run on every new development install. \
Sets up python's bin/venv Run on __demo_dev__ to provide docker repository access to __demo_prod__(24/7 Host). \
Note: Assumes localhost:5000 isn't already in use.
  * __bin/monitorBuild.sh__: Manually run on every new development session. \
To rebuild to a mounted docker volume for continuous updates.

## Video Production

* Installed Ubuntu's version of applications:
  * Video Recording: obs-studio with: `sudo apt install obs-studio`
  * Source Video Editor: kdenlive: `sudo apt install kdenlive` 



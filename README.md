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
  * [__demo_java__](images/demo_mariadb): Tomcat / Java
  * [__demo_cpp__](images/demo_cpp): With C++ using [Crow](https://github.com/CrowCpp/Crow) which is a fast and easy to use microframework for the web.
    * See [CMakeLists.txt](images/demo_cpp/CMakeLists.txt) for build details.
    * See [Crow API Reference](https://crowcpp.org/1.2.1/reference/index.html)
* __Development IDE's__:
  * [Qt Creator](https://doc.qt.io/qtcreator/) community version: C++ and Non-Qt application.
  * [IntelliJ IDEA](https://lp.jetbrains.com/intellij-idea-promo/?source=google&medium=cpc&campaign=AMER_en_CA_IDEA_Branded&term=intellij&content=693349187730&gad_source=1&gad_campaignid=9736964566&gbraid=0AAAAADloJziWCXmF9C2JjxmXI5bvH0jzq&gclid=Cj0KCQjwvJHIBhCgARIsAEQnWlCL-PVMKW_4T1Iy0MB7le3GVHoYtiCcmhlxbGJVUf2CynHhIUUIX5waAutcEALw_wcB): 
    Python, PHP, JavaScript, etc
* __Software Used__: See [installPackages.sh](bin/installPackages.sh)

## Implementation Notes:

Since this demo_ui is firstly for my own fun, the demo_ui manually builds with implementations that are already supported in
available frameworks. I started with an empty project, and incrementally added technology.


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

## Video Recording (Ubuntu)

* Using OBS Studio (Ubuntu application install)
* Open https://obsproject.com/
* Goto `Download`
* Follow Flatpak instructions
* Add Background removal: `flatpak install com.obsproject.Studio.Plugin.BackgroundRemoval`
* 
* Added [OBS Background Removal plugin](https://obsproject.com/forum/resources/background-removal-virtual-green-screen-low-light-enhance.1260/)
  using [pacstall](https://github.com/pacstall/pacstall)
* sudo apt install ./obs-backgroundremoval-1.1.13-x86_64-linux-gnu.deb 
* pacstall -I obs-backgroundremoval-deb
* s
* Open https://obsproject.com/
* Click Forum / Resources / Search Resources
* Keywords: Background Removal
* Click Search
* Click "Live Background Removal Lite 2.3.4"
* Click "Go to Download"
* Get: live-backgroundremoval-lite-2.3.3-x86_64-linux-gnu.deb
* sudo apt install ./live-backgroundremoval-lite-2.3.3-x86_64-linux-gnu.deb
* x


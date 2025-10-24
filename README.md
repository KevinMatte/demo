# Demo Project

Website: [http://184.64.118.116 bluebirdx external]

The planned demo_ui contains:

* Docker-Compose
* MySql
* Apache2
    * WSGI
* Python 3
* ...

## Implemntation Notes:

Since this demo_ui is firstly for my own fun, the demo_ui manually builds with implementations that are already supported in
available frameworks. I started with an empty project, and added technology a piece at a time.

Examples:

* __React__: `npm create vite@latest demo_ui -- --template react` was run in a separate directory, and the source
  integrated into the project.
* __GNU Makefile__: Launching point for most project build/run scripts.
* __bin/monitorBuild.sh, bin/fileWacher.py__: Redeploys on the dev machine using `make {target}` as I edit the source
  code.

The __bin__ directory contains developer helper scripts.

## Development Base

__Host: demo_dev__: Development machine, the localhost for all development activities.

__Host: demo_prod__: A 24/7 running machine. New demo_ui versions are pushed here for the public.

The following is run manually when I start my dev session:

__bin/initDevEnv.sh__: \
Sets up python's bin/venv Run on __demo_dev__ to provide docker repository access to __demo_prod_. \
Note: Assumes localhost:5000 isn't already in use.

____bin/monitorBuild.sh__: To rebuild to a mounted docker volume for continuous updates.


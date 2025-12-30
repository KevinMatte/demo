#!/bin/bash -e

cd $(dirname "$0")/..

# Lazily, create virtual environment for python scripts.
if [ \! -e bin/venv ]; then
    echo "Building bin/venv"
    python3 -m venv bin/venv
    . bin/venv/bin/activate
    pip install -r bin/requirements.txt
fi

. bin/venv/bin/activate

# ==========================
# Setup .secrets.env
# --------------------------

echo "==============================="
if [ -f .secrets.env ]; then
  . .secrets.env
  echo "Generating .secrets.env"
else
  echo "Generating .secrets.env"
fi
echo "-------------------------------"

printf "%s\n" "Note: A random password will be generated if left blank and is not set in .secrets.env. Check .secrets.env afterwards"

#
# readPassword {VAR_NAME}
function readPassword() {
  local new_password
  local invalidCharacters="1"

  while [ -n "${invalidCharacters}" ]; do
    eval [ -z "\${$1}" ] && message="Enter" || message="Replace"
    read -s -p "${message} ${1}: " new_password
    echo
    eval new_password=\${new_password:-\${${1}}}
    [ -z "${new_password}" ] && eval new_password=\${${1}}
    [ -z "${new_password}" ] && new_password="$(pwgen -r '"`#!'"'" -s -y 16 1)"
    set +e
    invalidCharacters="$(printf "%s" "${new_password}" | grep '["`#!'"'"])"
    set -e
    if [ -n "${invalidCharacters}" ]; then
      printf "\n%s\n" "  Invalid password characters: ${invalidCharacters}" 1>&2;
    fi
  done
  eval $1="\$(printf '%s' '${new_password}')"
}

#
# readUser {VAR_NAME} {DEFAULT VALUE}
function readUser() {
  local new_user

  local default_value
  eval default_value=\${${1}}
  [ -z "${default_value}" ] && eval default_value=\${${1}:-${2}}

  eval [ -z "\${$1}" ] && message="Enter" || message="Replace"
  read -p "${message} ${1} (*${default_value}): " new_user
  new_user=${new_user:-${default_value}}
  eval $1="\$(printf '%s' '${new_user}')"
}

readPassword MARIADB_ROOT_PASSWORD
readUser DEMO_JAVA_TOMCAT_MANAGER manager
readPassword DEMO_JAVA_TOMCAT_MANAGER_PASSWORD
readUser DEMO_JAVA_TOMCAT_ADMIN admin
readPassword DEMO_JAVA_TOMCAT_ADMIN_PASSWORD

cat > .secrets.env <<EOF
# Do not commit this file.
MARIADB_ROOT_PASSWORD='${MARIADB_ROOT_PASSWORD}'
DEMO_JAVA_TOMCAT_MANAGER='${DEMO_JAVA_TOMCAT_MANAGER}'
DEMO_JAVA_TOMCAT_MANAGER_PASSWORD='${DEMO_JAVA_TOMCAT_MANAGER_PASSWORD}'
DEMO_JAVA_TOMCAT_ADMIN='${DEMO_JAVA_TOMCAT_ADMIN}'
DEMO_JAVA_TOMCAT_ADMIN_PASSWORD='${DEMO_JAVA_TOMCAT_ADMIN_PASSWORD}'
EOF

bin/generateDotEnv.sh
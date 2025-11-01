#!/bin/bash -ex

DEMO_CPP_USER_NAME="${DEMO_CPP_USER_NAME:-kevin}"
DEMO_CPP_USER_ID="${DEMO_CPP_USER_ID:-2000}"
DEMO_CPP_GROUP_NAME="${DEMO_CPP_GROUP_NAME:-${DEMO_CPP_USER_NAME}}"
DEMO_CPP_GROUP_ID="${DEMO_CPP_GROUP_ID:-${DEMO_CPP_USER_ID}}"

if [ \! -d /home/${DEMO_CPP_USER_NAME} ]; then
  # Pass along docker environment variables.
  cat >>/etc/profile <<EOF

export DEMO_CPP_PORT=${DEMO_CPP_PORT}
EOF

  groupadd -g ${DEMO_CPP_GROUP_ID} ${DEMO_CPP_GROUP_NAME}
  useradd -u ${DEMO_CPP_USER_ID} -g ${DEMO_CPP_GROUP_ID} -m -s /bin/bash ${DEMO_CPP_USER_NAME}
  mv /home/_user_/* /home/${DEMO_CPP_USER_NAME}
  rm -fr /home/_user_
  chown -R ${DEMO_CPP_USER_NAME}:${DEMO_CPP_USER_NAME} /home/${DEMO_CPP_USER_NAME}
fi

su -l ${DEMO_CPP_USER_NAME} -c './demo_cpp'

#!/bin/bash -e

DEMO_NODEJS_USER_NAME="${DEMO_NODEJS_USER_NAME:-kevin}"
DEMO_NODEJS_USER_ID="${DEMO_NODEJS_USER_ID:-2000}"
DEMO_NODEJS_GROUP_NAME="${DEMO_NODEJS_GROUP_NAME:-${DEMO_NODEJS_USER_NAME}}"
DEMO_NODEJS_GROUP_ID="${DEMO_NODEJS_GROUP_ID:-${DEMO_NODEJS_USER_ID}}"

if [ \! -d /home/${DEMO_NODEJS_USER_NAME} ]; then
  # Pass along docker environment variables.
  cat >>/etc/profile <<EOF

export DEMO_NODEJS_PORT=${DEMO_NODEJS_PORT}
export NO_CORS=${NO_CORS}
EOF

  groupadd -g ${DEMO_NODEJS_GROUP_ID} ${DEMO_NODEJS_GROUP_NAME}
  useradd -u ${DEMO_NODEJS_USER_ID} -g ${DEMO_NODEJS_GROUP_ID} -m -s /bin/bash ${DEMO_NODEJS_USER_NAME}
  mv /home/_user_/* /home/${DEMO_NODEJS_USER_NAME}
  rm -fr /home/_user_
  chown -R ${DEMO_NODEJS_USER_NAME}:${DEMO_NODEJS_USER_NAME} /home/${DEMO_NODEJS_USER_NAME}
fi

su -l ${DEMO_NODEJS_USER_NAME} -c 'node server'

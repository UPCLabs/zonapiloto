FROM rabbitmq:3.13

RUN apt-get update && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*

RUN curl -o /usr/local/bin/rabbitmqadmin \
    https://github.com/rabbitmq/rabbitmqadmin-ng/releases/download/v2.16.0/rabbitmqadmin-2.16.0-x86_64-unknown-linux-gnu \
    && chmod +x /usr/local/bin/rabbitmqadmin

RUN rabbitmqadmin --version || echo "rabbitmqadmin instalado"

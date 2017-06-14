FROM node:6-slim
# Working directory for application

RUN mkdir -p /code
WORKDIR /code
ADD . /code

EXPOSE 6100

CMD ['npm', 'start']
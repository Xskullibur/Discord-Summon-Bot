# Dockerizing Application

## Modify Dockerfile
Modify the Dockerfile based on the desired configuration

```docker
# Uncomment if building for development
RUN npm install

# Uncomment if building for production
RUN npm ci --only=production
```

## Build the docker image
```bash
docker build . -f docker/Dockerfile -t <your username>/discord-summon-bot
```

## Run the container
```bash
docker run -p 49160:3000 -d <your username>/node-web-app
```

## Print the logs
```bash
# Get container ID
$ docker ps

# Print app output
$ docker logs <container id>

# Example
Running on http://localhost:8080
```

## Execute commands in the container
```bash
$ docker exec -it <container id> /bin/bash
```

## Test the application
```bash
$ docker ps

# Example
ID            IMAGE                                COMMAND    ...   PORTS
ecce33b30ebf  <your username>/node-web-app:latest  npm start  ...   49160->8080
```

```bash
$ curl -i localhost:49160

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 12
ETag: W/"c-M6tWOb/Y57lesdjQuHeB1P/qTV0"
Date: Mon, 13 Nov 2017 20:53:59 GMT
Connection: keep-alive
```

## Shutdown the image
```bash
# Kill our running container
$ docker kill <container id>
<container id>

# Confirm that the app has stopped
$ curl -i localhost:49160
curl: (7) Failed to connect to localhost port 49160: Connection refused
```
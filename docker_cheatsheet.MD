---
# ehkrDocker Command Cheatsheetefd
---

# 🐳 Docker Commands


## 🔑 Login

```
docker login
```

---

## 🏗️ Build Image

```
docker build -t <username>/<repo>:<tag> .
# Example:
docker build -t parmar24c/express-server-node:latest .
```

---

## 🚀 Run Container

```
docker run <image>
docker run -d -p 3000:3000 <image>
docker run -e PORT=4000 -d -p 4000:4000 <image>
```

---

## 📋 List Images & Containers

```
docker images               # List images
docker ps                   # List running containers
docker ps -a                # List all containers
```

---

## 🛑 Stop & Remove

```
docker stop <container_id>
docker rm <container_id>
docker rmi <image_id>
```

---

## 📦 Push & Pull

```
docker push <username>/<repo>:<tag>
docker pull <username>/<repo>:<tag>
```

---

## 🧹 Prune

```
docker container prune      # Remove stopped containers
docker image prune          # Remove unused images
docker volume prune         # Remove unused volumes
docker system prune         # Remove all unused data
```

---

## ⚙️ Docker Compose

```
docker compose build
docker compose up
docker compose up -d
docker compose down
docker compose ps
docker compose logs -f
```

---

## 🛠️ Exec Into Container

```
docker exec -it <container_id> sh
docker exec -it <container_id> bash
```

---

## 🏷️ Tag Image

```
docker tag <image_id> <username>/<repo>:<tag>
```

---

## 💾 Save & Load Image

```
docker save -o <path>.tar <image>
docker load -i <path>.tar
```

---

## 🔍 Inspect

```
docker inspect <container_id_or_image>
```

---

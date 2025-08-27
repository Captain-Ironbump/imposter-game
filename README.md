# 🚀 Imposter Game mit Docker Stack starten (Frontend, Backend, Reverse Proxy)

Dieses Projekt zeigt, wie man das **Imposter Game** mit drei Diensten (Frontend, Backend und Reverse Proxy) in einem Docker-Stack ausführt.  
Jeder Dienst basiert auf demselben Docker-Image (`myname/myimage`), aber mit unterschiedlichen Tags (`frontend`, `backend`, `reverseproxy`).  

---

## 📦 Voraussetzungen

- [Docker](https://docs.docker.com/get-docker/) installiert  
- [Docker Compose](https://docs.docker.com/compose/install/) installiert
- Port ´3105´ muss freigegeben werden

---

## 🛠️ Schritt 1: `docker-compose.yml` erstellen

Lege im Root-Verzeichnis deines Projekts eine Datei mit dem Namen **`docker-compose.yml`** an und füge folgenden Inhalt ein:

```yaml
version: "3.9"

services:
  frontend:
    image: captainironbump/imposter-game:frontend
    environment:
      - NEXT_PUBLIC_SOCKET_URL=/
      - SERVER_WEB_SOCKET_PATH=/socket.io
    networks:
      - imposter-game-network

  backend:
    image: captainironbump/imposter-game:backend
    expose:
      - 4000
    networks:
      - imposter-game-network

  reverse-proxy:
    image: captainironbump/imposter-game:reverse-proxy
    ports:
      - "3105:80"
    depends_on:
      - frontend
      - backend
    networks:
      - imposter-game-network

networks:
  imposter-game-network:
    driver: bridge
```

Um die services von docker Hub zu pullen und zu starten, muss im selben Directory die **`docker-compose.yml`** mit folgendem Kommand ausgeführt:
```yaml
docker compose -p imposter-game up -d
```

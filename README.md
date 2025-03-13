### **\ud83d\udccc socketio-bullmq-microservices**  
A **Node.js microservices demo** using **Socket.io** for real-time communication and **BullMQ** (Redis-based queue) for inter-service messaging.  

---

## **\ud83d\udcda Overview**
This project demonstrates how to:  
✅ Use **Socket.io** to manage real-time WebSocket connections at the API Gateway.  
✅ Use **BullMQ** (powered by Redis) as a queue to communicate between microservices.  
✅ Broadcast events from services to **connected clients** via WebSockets.  

### **\ud83d\udee0\ufe0f Technologies Used**
- **Node.js** (Express.js)  
- **Socket.io** (WebSockets)  
- **BullMQ** (Queue system)  
- **Redis** (Used for BullMQ)  
- **Docker** (For Redis)  

---

## **\ud83d\udcc2 Folder Structure**
```
socketio-bullmq-microservices
│── api-gateway/          # Handles WebSocket connections & listens to queue
│   ├── server.js
│── service-a/            # Adds jobs to the BullMQ queue
│   ├── serviceA.js
│── service-b/            # Processes jobs from the BullMQ queue
│   ├── serviceB.js
│── README.md             # Project documentation
│── docker-compose.yml    # Redis setup
│── .env                  # Environment variables
```

---

## **\u2728 How It Works**
1️⃣ **Clients connect to WebSocket** via the **API Gateway**  
2️⃣ **Service A** adds messages to the **BullMQ queue**  
3️⃣ **Service B** processes the queue and sends events to **API Gateway**  
4️⃣ **API Gateway** **broadcasts updates** to WebSocket clients  

---

## **\ud83d\udcaa Setup & Installation**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/YOUR_USERNAME/socketio-bullmq-microservices.git
cd socketio-bullmq-microservices
```

### **2️⃣ Start Redis (Using Docker)**
Ensure Redis is running:
```sh
docker run -d --name redis -p 6379:6379 redis:7
```
or use **docker-compose.yml**:
```sh
docker-compose up -d
```

### **3️⃣ Install Dependencies**
Run the following inside each service folder (`api-gateway`, `service-a`, `service-b`):
```sh
npm install
```

### **4️⃣ Start the Services**
#### **Start API Gateway (WebSocket Server)**
```sh
cd api-gateway
node server.js
```
#### **Start Service A (Adds Jobs)**
```sh
cd service-a
node serviceA.js
```
#### **Start Service B (Processes Jobs)**
```sh
cd service-b
node serviceB.js
```

---

## **\ud83d\udee0\ufe0f Testing the System**
1️⃣ Open the **API Gateway WebSocket** in a browser using:  
   ```
   ws://localhost:5000
   ```
2️⃣ Send a message from **Service A**, and it should be:  
   - Added to the queue  
   - Processed by **Service B**  
   - Broadcasted to WebSocket clients  

---

## **\ud83d\udcc4 Example API Calls**
### **Service A: Add Job to Queue**
```sh
curl -X POST http://localhost:8081/add-job -H "Content-Type: application/json" -d '{"message": "Hello from Service A!"}'
```
✅ **Expected Output:**  
Service A will add the job, Service B will process it, and WebSocket clients will receive an event.

---

## **\ud83d\udcdc Environment Variables (`.env`)**
Create a `.env` file in each service with:
```ini
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

---

## **\ud83d\udee0 Troubleshooting**
- **Redis connection issues?**  
  - Ensure Redis is running: `docker ps`  
  - Try: `docker restart redis`  

- **No WebSocket updates?**  
  - Check logs: `docker logs redis --tail 50`  
  - Restart API Gateway  




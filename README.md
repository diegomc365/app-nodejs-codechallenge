# App Node.js Code Challenge

Este proyecto está construido con **NestJS**, **GraphQL**, **Kafka** y **Prisma**, siguiendo una arquitectura hexagonal y separando la lógica en **microservicios**.

## 🚀 Requisitos

- **Node.js** v18+
- **npm** v9+
- **Docker** y **Docker Compose** instalados

## 📦 Instalación

Clonar el repositorio e instalar dependencias globales si fuera necesario:

```bash
npm install
```

## ▶️ Levantar los servicios

El proyecto cuenta con **dos microservicios**:

- **transactions-service** → Gestiona las transacciones y expone API GraphQL.
- **anti-fraud-service** → Evalúa las transacciones y decide si aprobarlas o rechazarlas.

### Opción 1: Usando Docker Compose (recomendado)

Este comando levantará ambos servicios junto a Kafka:

```bash
docker-compose up --build
```

### Opción 2: Ejecutar manualmente en modo desarrollo

Abrir **dos terminales**:

**Terminal 1 - Transactions Service**

```bash
cd services/transactions-service
npm install
npm run dev
```

**Terminal 2 - Anti-Fraud Service**

```bash
cd services/anti-fraud-service
npm install
npm run dev
```

> **Nota:** Asegurarse de que Kafka esté corriendo antes de iniciar los servicios.

## 📌 Uso de GraphQL

Una vez levantado el **transactions-service**, abrir el Playground de GraphQL en:

```
http://localhost:3000/graphql
```

### Ejemplos de operaciones

**Crear transacción**

```graphql
mutation {
  createTransaction(
    input: {
      accountExternalIdDebit: "123"
      accountExternalIdCredit: "456"
      tranferTypeId: 1
      value: 500
    }
  ) {
    id
    transactionStatus {
      name
    }
    value
  }
}
```

**Obtener transacción**

```graphql
query {
  transaction(id: "tx-1") {
    id
    transactionStatus {
      name
    }
    value
  }
}
```

## 🧪 Ejecutar Tests

Cada microservicio tiene sus propias pruebas unitarias.

**Transactions Service**

```bash
npm --prefix services/transactions-service test
```

**Anti-Fraud Service**

```bash
npm --prefix services/anti-fraud-service test
```

## 🔄 Flujo de prueba completo

1. Levantar **transactions-service** y **anti-fraud-service**.
2. Crear una transacción desde GraphQL.
3. El **transactions-service** envía el evento a Kafka.
4. El **anti-fraud-service** recibe el evento, evalúa y actualiza el estado (aprobada o rechazada).
5. Consultar nuevamente la transacción para verificar el cambio de estado.

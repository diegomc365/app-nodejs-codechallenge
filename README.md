# App Node.js Code Challenge

Este proyecto es una aplicación construida con **NestJS**, **GraphQL**, y **Prisma**, siguiendo principios de arquitectura limpia y separación por capas (`application`, `domain`, `infrastructure`).

## 🚀 Requisitos

- Node.js v18+
- npm v9+
- Base de datos configurada (Prisma)

## 📦 Instalación

```bash
npm install
```

## ▶️ Levantar el proyecto

Para iniciar el proyecto en modo desarrollo:

```bash
npm run dev
```

Esto levantará la aplicación con **watch mode**.

## 🧪 Ejecutar tests

Para correr todos los tests (unitarios y e2e, excepto los ignorados):

```bash
npm test
```

Para ver cobertura:

```bash
npm run test:cov
```

## 📂 Estructura de carpetas

```
src/
 ├── application/    # Casos de uso
 ├── domain/         # Entidades, enums, puertos
 ├── infraestructure # Adapters: GraphQL, Kafka, Repositorios
 └── main.ts         # Bootstrap de la app
```

## 📌 Ejemplos de queries y mutations en GraphQL

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
    transactionType {
      name
    }
    value
    createdAt
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

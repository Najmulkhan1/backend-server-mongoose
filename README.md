# Database Management Systems (DBMS) Fundamentals

**Diagram Link:** [View Database Concepts Diagram](https://drive.google.com/file/d/1sbPJTu38UQ3GpyHEJW4Sd29zfvNcKZWc/view?usp=sharing)

**APi Image Link:** [View Api image](https://drive.google.com/file/d/1N04J3exDdbJswEfzp6jFcN1pnATZrAbo/view?usp=sharing)
**APi Image Link 1:** [Register Api image](https://drive.google.com/file/d/19uP6_0CtWwOqMRnzxQt-TP90B3H7owqN/view?usp=sharing)
**APi Image Link 2:** [Verify Api image](https://drive.google.com/file/d/18RfBG-0yfdGhtTxZBRpuPfYNffs2zsJo/view?usp=sharing)
**APi Image Link 3:** [Login Api image](https://drive.google.com/file/d/1iDwhoxqBtE7hIQ9Y50OwBJuJFw2VaBbn/view?usp=sharing)



# Prisma ORM Interview Questions & Answers

---

## 1. What is Prisma ORM and why is it used in backend development?

**Prisma** is a modern **Object-Relational Mapper (ORM)** for Node.js and TypeScript that simplifies database access by letting you interact with your database using **type-safe JavaScript/TypeScript code** instead of raw SQL.

### Why Prisma is used:
- ✅ **Type Safety** — auto-generates TypeScript types from your schema, catching errors at compile time
- ✅ **Auto-completion** — full IntelliSense support in editors like VS Code
- ✅ **Readable Queries** — clean, intuitive API instead of complex SQL
- ✅ **Migration System** — tracks and applies database schema changes automatically
- ✅ **Multi-database Support** — works with PostgreSQL, MySQL, SQLite, MongoDB, and more
- ✅ **Prisma Studio** — built-in visual GUI to browse and edit your database

### Without Prisma (raw SQL):
```js
const result = await db.query("SELECT * FROM users WHERE id = $1", [1]);
```

### With Prisma:
```js
const user = await prisma.user.findUnique({ where: { id: 1 } });
```

> Prisma makes backend development **faster, safer, and more maintainable**.

---

## 2. Difference between `findUnique()` and `findFirst()`

| Feature | `findUnique()` | `findFirst()` |
|---|---|---|
| Searches by | **Unique or Primary Key** fields only | **Any field** |
| Returns | One record or `null` | First matching record or `null` |
| Multiple matches | ❌ Not possible (unique fields) | ✅ Returns the first one |
| `orderBy` support | ❌ No | ✅ Yes |
| Performance | Slightly faster (indexed lookup) | Slightly slower (full scan possible) |

### `findUnique()` — must use a unique/primary field
```js
// Find user by primary key (id)
const user = await prisma.user.findUnique({
  where: { id: 1 },
});

// Find user by unique field (email)
const user = await prisma.user.findUnique({
  where: { email: "john@example.com" },
});
```

### `findFirst()` — can use any field, with optional ordering
```js
// Find first user with a specific name
const user = await prisma.user.findFirst({
  where: { name: "John" },
  orderBy: { createdAt: "desc" }, // get the most recent one
});
```

> Use `findUnique()` when searching by **id or email**.
> Use `findFirst()` when searching by **non-unique fields**.

---

## 3. What is Prisma Migration and why is `prisma migrate dev` used?

### What is a Migration?
A **migration** is a recorded set of changes to your database schema (e.g., adding a table, adding a column, changing a data type). Prisma tracks these changes in migration files so your database stays in sync with your `schema.prisma`.

### `prisma migrate dev` — used during Development
```bash
npx prisma migrate dev --name add_users_table
```

### What it does:
1. 🔍 Detects changes in your `schema.prisma`
2. 📝 Creates a new **SQL migration file** inside `prisma/migrations/`
3. 🚀 Applies the migration to your **development database**
4. 🔄 Regenerates **Prisma Client** automatically

### Other migration commands:

| Command | Purpose |
|---|---|
| `prisma migrate dev` | Apply migrations in **development** |
| `prisma migrate deploy` | Apply migrations in **production** |
| `prisma migrate reset` | Reset DB and re-run all migrations |
| `prisma migrate status` | Check which migrations have been applied |

### Example flow:
```
1. You add a new model to schema.prisma
2. Run: npx prisma migrate dev --name add_post_table
3. Prisma creates: prisma/migrations/20240101_add_post_table/migration.sql
4. Migration is applied to the database ✅
```

> Migration ensures your **database schema and code always stay in sync**.

---

## 4. Difference between `select` and `include` in Prisma

### `select` — Choose ONLY specific fields to return
```js
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    name: true,
    email: true,
    // password is NOT selected — good for security!
  },
});

// Result:
// { id: 1, name: "John", email: "john@example.com" }
```

### `include` — Return ALL fields + include related models
```js
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true,   // includes all related posts
    profile: true, // includes related profile
  },
});

// Result:
// {
//   id: 1,
//   name: "John",
//   email: "john@example.com",
//   posts: [ { id: 1, title: "Hello World" }, ... ],
//   profile: { bio: "Developer" }
// }
```

### Key Differences:

| Feature | `select` | `include` |
|---|---|---|
| Returns | Only selected fields | All fields + relations |
| Use case | Control exact output shape | Load related data (joins) |
| Can fetch relations? | ✅ Yes (with nested select) | ✅ Yes |
| Can be used together? | ❌ Cannot use both at same level | ❌ Cannot use both at same level |

### Nested select inside include:
```js
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      select: {
        title: true, // only get post titles
        createdAt: true,
      },
    },
  },
});
```

> Use `select` to **limit fields** (performance + security).
> Use `include` to **load related models** (like SQL JOIN).

---

## 5. Purpose of Prisma Schema File (`schema.prisma`) and its Main Sections

The `schema.prisma` file is the **heart of your Prisma setup**. It is the single source of truth that defines:
- How Prisma connects to your database
- The structure of your database tables (models)
- How Prisma Client is generated

### It has 3 main sections:

---

### Section 1: `generator` — Prisma Client configuration
Tells Prisma to generate the client library you use in your code.

```prisma
generator client {
  provider = "prisma-client-js"
}
```

---

### Section 2: `datasource` — Database connection
Defines which database to connect to and the connection URL.

```prisma
datasource db {
  provider = "postgresql"   // or "mysql", "sqlite", "mongodb"
  url      = env("DATABASE_URL")  // stored in .env file
}
```

---

### Section 3: `model` — Database tables/collections
Defines your tables, columns, data types, and relationships.

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  posts     Post[]   // one-to-many relation
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
}
```

### Common Prisma Field Attributes:

| Attribute | Meaning |
|---|---|
| `@id` | Primary key |
| `@unique` | Unique constraint |
| `@default(value)` | Default value |
| `@relation(...)` | Defines a relationship |
| `@updatedAt` | Auto-updates timestamp |
| `?` after type | Field is optional (nullable) |

### Full example `schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}
```

> The `schema.prisma` file lets you **design your entire database visually in one place** — Prisma handles the rest.

---

*Prisma ORM Interview Preparation Guide*


# SQL Interview Questions & Answers

---

## 1. DELETE vs TRUNCATE vs DROP

| Command | What it does | Rollback? | WHERE clause? | Removes structure? |
|---|---|---|---|---|
| `DELETE` | Removes specific rows | ✅ Yes | ✅ Yes | ❌ No |
| `TRUNCATE` | Removes **all** rows fast | ❌ No | ❌ No | ❌ No |
| `DROP` | Removes the **entire table** | ❌ No | ❌ No | ✅ Yes |

```sql
DELETE FROM employees WHERE id = 5;   -- removes one row
TRUNCATE TABLE employees;             -- empties the table
DROP TABLE employees;                 -- deletes the table entirely
```

---

## 2. What is a PRIMARY KEY?

A **PRIMARY KEY** is a column (or set of columns) that **uniquely identifies each row** in a table.

- Cannot be `NULL`
- Must be **unique**
- Only **one** per table

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);
```

---

## 3. PRIMARY KEY vs UNIQUE KEY

| Feature | PRIMARY KEY | UNIQUE KEY |
|---|---|---|
| Uniqueness | ✅ Must be unique | ✅ Must be unique |
| NULL allowed | ❌ No | ✅ Yes (one NULL) |
| Count per table | Only **one** | **Multiple** allowed |
| Purpose | Row identifier | Enforce uniqueness on other columns |

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,        -- primary key
    email VARCHAR(100) UNIQUE  -- unique key
);
```

---

## 4. What is a FOREIGN KEY?

A **FOREIGN KEY** is a column that **links one table to the PRIMARY KEY of another table**. It enforces **referential integrity** — you can't insert a value that doesn't exist in the parent table.

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

> If `customer_id = 99` doesn't exist in `customers`, the insert will **fail**.

---

## 5. What is JOIN in SQL?

A **JOIN** combines rows from two or more tables based on a related column.

### INNER JOIN
Returns only rows that have **matching values in both tables**.

```sql
SELECT e.name, d.department_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;
-- Only employees WHO HAVE a matching department are returned
```

### LEFT JOIN
Returns **all rows from the left table**, and matched rows from the right (NULL if no match).

```sql
SELECT e.name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;
-- ALL employees returned; department is NULL if unassigned
```

---

## 6. What is Normalization?

**Normalization** is the process of organizing a database to **reduce redundancy** and **improve data integrity**.

### 1NF (First Normal Form)
- Each column must hold **atomic (indivisible) values**
- No repeating groups or arrays

```
❌ Bad:  | John | Math, Science |
✅ Good: | John | Math          |
         | John | Science       |
```

### 2NF (Second Normal Form)
- Must be in 1NF
- **No partial dependency** — every non-key column must depend on the **whole** primary key

```
❌ Bad:  (student_id, course_id) → student_name  [name depends only on student_id]
✅ Good: Move student_name to a separate Students table
```

### 3NF (Third Normal Form)
- Must be in 2NF
- **No transitive dependency** — non-key columns must not depend on other non-key columns

```
❌ Bad:  employee_id → dept_id → dept_name  [dept_name depends on dept_id, not emp]
✅ Good: Move dept_name to a separate Departments table
```

---

## 7. What is Indexing?

An **index** is a data structure that allows the database to **find rows faster** — like a book's index instead of reading every page.

### Why use an index?
- ⚡ Speeds up `SELECT` / `WHERE` / `JOIN` queries dramatically
- Used on columns that are frequently searched or filtered

```sql
CREATE INDEX idx_email ON users(email);

-- Now this query is much faster:
SELECT * FROM users WHERE email = 'test@example.com';
```

> ⚠️ **Trade-off:** Indexes **slow down** `INSERT`, `UPDATE`, `DELETE` slightly because the index must also be updated.

---

## 8. WHERE vs HAVING

| | WHERE | HAVING |
|---|---|---|
| Filters | **Individual rows** | **Grouped rows** |
| Used with | Any query | `GROUP BY` queries |
| Aggregate functions? | ❌ No | ✅ Yes |

```sql
-- WHERE filters rows BEFORE grouping
SELECT dept, COUNT(*)
FROM employees
WHERE salary > 30000
GROUP BY dept;

-- HAVING filters AFTER grouping
SELECT dept, COUNT(*) AS total
FROM employees
GROUP BY dept
HAVING COUNT(*) > 5;
```

---

## 9. What is a Transaction in SQL?

A **transaction** is a sequence of SQL operations treated as a **single unit**. Either ALL succeed or NONE do. (Follows **ACID** properties)

### COMMIT
Permanently saves the transaction.

### ROLLBACK
Undoes all changes if something goes wrong.

```sql
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 1000 WHERE id = 1;  -- debit
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;  -- credit

-- If both succeed:
COMMIT;

-- If any error occurs:
ROLLBACK;  -- both updates are reversed
```

> **Real-world example:** Bank transfer — money must leave one account AND enter another. If either fails, both must be undone.

---

## 10. Query to Find the Second Highest Salary

### Method 1 — Subquery (Classic)
```sql
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

### Method 2 — LIMIT/OFFSET
```sql
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
```

### Method 3 — DENSE_RANK() ✅ Best for Interviews
```sql
SELECT salary
FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) ranked
WHERE rnk = 2;
```

> `DENSE_RANK()` handles **duplicate salaries** correctly, making it the most robust solution.

---

*SQL Interview Preparation Guide*




This document provides a comprehensive overview of essential database concepts, ranging from basic key definitions to advanced scaling techniques.

---

## 1. Primary Key vs. Foreign Key
* **Primary Key (PK):** A unique identifier for a record in a table. It cannot contain `NULL` values and must be unique across all rows. Each table can have only one primary key.
* **Foreign Key (FK):** A field in one table that refers to the Primary Key of another table. It establishes a link between the two tables, ensuring **referential integrity**. Unlike a PK, a foreign key can contain duplicate values or `NULL`s.

## 2. Why is Normalization Important?
Normalization is the process of organizing data in a database to:
* **Reduce Redundancy:** Prevents storing the same information in multiple places.
* **Maintain Data Integrity:** Ensures that data is logically stored.
* **Prevent Anomalies:** Avoids issues during insertion, updating, or deletion (e.g., deleting a customer shouldn't accidentally delete their entire order history if stored incorrectly).

## 3. What is a JOIN?
A `JOIN` clause is used to combine rows from two or more tables based on a related column between them.
* **Inner Join:** Returns records that have matching values in both tables.
* **Left Join:** Returns all records from the left table and matched records from the right.
* **Right Join:** Returns all records from the right table and matched records from the left.
* **Full Join:** Returns all records when there is a match in either table.

## 4. SQL vs. MongoDB
| Feature | SQL (Relational) | MongoDB (NoSQL) |
| :--- | :--- | :--- |
| **Structure** | Table-based (Rows/Columns) | Document-based (JSON/BSON) |
| **Schema** | Fixed/Predefined | Dynamic/Schema-less |
| **Scaling** | Vertically (Upgrading hardware) | Horizontally (Adding more servers) |
| **Best For** | Complex queries & transactions | Rapid development & big data |

## 5. What is a Composite Key?
A **Composite Key** is a primary key that consists of two or more columns. It is used when a single column is not enough to uniquely identify a row, but the combination of multiple columns is. For example, in a `Student_Course` table, the combination of `Student_ID` and `Course_ID` would be a composite key.

## 6. What is a Weak Entity?
A **Weak Entity** is an entity that cannot be uniquely identified by its own attributes alone. It depends on a **Strong Entity** (owner entity) for its existence.
* *Example:* A "Dependent" in an insurance database is a weak entity because it cannot exist without the "Employee" (the policyholder).

## 7. Why do we use Constraints?
Constraints are rules applied to table columns to limit the type of data that can go into them. This ensures the **accuracy and reliability** of the data.
* `NOT NULL`: Ensures a column cannot have a NULL value.
* `UNIQUE`: Ensures all values in a column are different.
* `CHECK`: Ensures that the values satisfy a specific condition.

## 8. Many-to-Many Relationship
A Many-to-Many ($M:N$) relationship occurs when multiple records in one table are associated with multiple records in another.
* *Example:* Students and Courses. One student can enroll in many courses, and one course can have many students.
* **Implementation:** Relational databases require a **junction table** (mapping table) containing foreign keys from both related tables.

## 9. Clustered vs. Non-Clustered Index
* **Clustered Index:** Determines the physical order of data in a table. There can only be **one** per table (usually the Primary Key).
* **Non-Clustered Index:** A separate structure that contains pointers to the actual data. You can have multiple non-clustered indexes on a table.

## 10. Database Sharding vs. Partitioning
### Partitioning
Splits a large table into smaller, more manageable pieces within a **single** database instance.
* **When to use:** When a table has millions of rows and you need to speed up queries by scanning specific ranges.

### Sharding
A type of horizontal partitioning that distributes data across **multiple** separate database servers.
* **When to use:** When your dataset is too large for a single machine or your traffic exceeds the capacity of one server.
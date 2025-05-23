# RAW SQL

```typescript
const email = "emelie@prisma.io";
const result = await prisma.$queryRaw(Prisma.sql`SELECT * FROM User WHERE email = ${email}`);
```

**Database Triggers and Stored Procedures (Functions)**

  * These are pieces of procedural logic written in SQL (or PostgreSQL's PL/pgSQL) that live and execute **directly within the database server**.
  * They run independently of your application code that uses Prisma.
  * Prisma's `schema.prisma` file **does not** include syntax for defining database triggers, stored procedures, or functions directly.

**How to Add Them with a Prisma Project**

Since Prisma doesn't manage triggers or procedures *in* `schema.prisma`, you need to add them to your database using **raw SQL**. The best way to manage this raw SQL alongside your Prisma-managed schema is by including it within your **Prisma migrations**.

Here's the typical process:

**Step 1: Create a New Prisma Migration**

When you need to add a trigger or stored procedure, you should create a new migration that includes the SQL to define these objects.

```bash
npx prisma migrate dev --name add_user_trigger_and_procedure # Use a descriptive name
```

This command will:

1.  Compare your `schema.prisma` to the current database state.
2.  If there are pending schema changes from `schema.prisma`, it will generate the necessary SQL files to apply those changes.
3.  Crucially, it creates an empty or partially filled migration file (or set of files) for this migration version in the `prisma/migrations` directory.

**Step 2: Manually Add Raw SQL to the Migration File**

Navigate to the newly created migration directory within `prisma/migrations/<migration_name>/`. You will find one or more `.sql` files (often `migration.sql`). This file contains the SQL generated by Prisma based on your `schema.prisma`.

You will **manually add** the `CREATE TRIGGER` and `CREATE FUNCTION` (for stored procedures/functions in PostgreSQL) statements into this `.sql` file.

**Example: Adding a Simple Trigger and Function (PL/pgSQL for PostgreSQL)**

Let's say you want a trigger that logs user creation and a function to get user count.

  * **Your SQL function (stored procedure):**

    ```sql
    -- Example function to get total user count
    CREATE OR REPLACE FUNCTION get_user_count()
    RETURNS BIGINT
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN (SELECT COUNT(*) FROM "User");
    END;
    $$;
    ```

  * **Your SQL trigger function:**

    ```sql
    -- Example function executed by the trigger
    CREATE OR REPLACE FUNCTION log_user_creation()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RAISE NOTICE 'New user created: %', NEW.email;
      -- You could add logging to a separate table here
      RETURN NEW; -- Important for AFTER INSERT triggers
    END;
    $$;
    ```

  * **Your SQL trigger:**

    ```sql
    -- Example trigger that fires after a new user is inserted
    CREATE TRIGGER user_creation_log_trigger
    AFTER INSERT ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION log_user_creation();
    ```

  * **Adding to the `migration.sql` file:** Find the appropriate place in the generated `migration.sql` file. If your trigger/function depends on the `"User"` table existing, make sure your `CREATE FUNCTION` and `CREATE TRIGGER` statements come *after* any `CREATE TABLE "User"` or `ALTER TABLE "User"` statements generated by Prisma in the same migration file.

    ```sql
    -- prisma/migrations/<timestamp>_add_user_trigger_and_procedure/migration.sql

    -- SQL generated by Prisma for schema changes (if any)
    -- For example:
    -- CREATE TABLE "User" ( ... );
    -- ALTER TABLE "User" ADD COLUMN ...;

    -- Add your custom SQL for functions/procedures
    CREATE OR REPLACE FUNCTION log_user_creation()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RAISE NOTICE 'New user created: %', NEW.email;
      RETURN NEW;
    END;
    $$;

    CREATE OR REPLACE FUNCTION get_user_count()
    RETURNS BIGINT
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN (SELECT COUNT(*) FROM "User");
    END;
    $$;


    -- Add your custom SQL for triggers
    CREATE TRIGGER user_creation_log_trigger
    AFTER INSERT ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION log_user_creation();

    -- You might also need corresponding DROP statements in the "down" migration if you manually created one
    -- Prisma migrate dev handles the down migration automatically for you based on the state before running up
    ```

**Step 3: Apply the Migration**

Run the migration command again. If you used `npx prisma migrate dev`, it already applied the changes including your manually added SQL. If you were preparing for production, you would use `npx prisma migrate deploy`.

```bash
npx prisma migrate dev # If you haven't applied it yet
# Or for production deployment:
# npx prisma migrate deploy
```

This executes the `migration.sql` file, creating your function and trigger in the database.

**Calling Stored Procedures/Functions from your Application Code**

Prisma Client does not generate type-safe methods for custom stored procedures or functions you create. You must use Prisma's **raw database access methods**:

  * `prisma.$executeRaw`: For commands that don't return a result set (like calling a procedure that performs an action).
  * `prisma.$queryRaw`: For commands that return a result set (like calling a function that returns data).

<!-- end list -->

```typescript
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function callDatabaseObjects() {
  try {
    // --- Calling the function (get_user_count) ---
    // Note: $queryRaw returns a complex type, often needs casting or careful handling
    const result = await prisma.$queryRaw<{ get_user_count: bigint }[]>(
      Prisma.sql`SELECT get_user_count();`
    );
    const userCount = result[0].get_user_count;
    console.log(`Total user count from DB function: ${userCount}`);

    // --- Example of how a trigger might fire (implicitly on user creation) ---
    // When you create a user using Prisma Client, the user_creation_log_trigger will automatically run in the database
    // This doesn't require special code in your app to *call* the trigger, just the action that causes it to fire.
    // const newUser = await prisma.user.create({
    //   data: {
    //     email: 'trigger.test@example.com',
    //     password: 'hashed_password',
    //   }
    // });
    // console.log('Created user via Prisma, trigger should have fired.');


  } catch (error) {
    console.error('Error interacting with database objects:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// callDatabaseObjects();
```

**Key Takeaways:**

  * Triggers and stored procedures are database objects managed with raw SQL.
  * Prisma migrations are the standard way to deploy this raw SQL alongside your schema changes.
  * Manually add your `CREATE FUNCTION` and `CREATE TRIGGER` statements to the generated `.sql` migration files.
  * Call database functions/procedures from your application code using `prisma.$queryRaw` or `prisma.$executeRaw`.
  * Be mindful of SQL syntax and database specifics (like PL/pgSQL for PostgreSQL).
  * Managing complex database logic via raw SQL in migrations requires careful versioning and testing.


```sql
DROP PROCEDURE check_if_underage();
DROP TRIGGER on_user_insert ON users;
CREATE OR REPLACE FUNCTION check_if_underage()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
	IF NEW.age < 18 THEN
	    INSERT INTO underage (name)
	    VALUES (NEW.name);
	END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_insert
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION check_if_underage();
```

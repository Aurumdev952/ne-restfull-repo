Okay, let's add a simple API endpoint with pagination using your existing stack (Express, TypeScript, Prisma, Zod, Swagger). We'll create a GET endpoint to list users with pagination.

**1. Update Zod Schemas (Add Pagination Schema)**

Define a Zod schema for the expected pagination query parameters (e.g., `page` and `pageSize`).

```typescript
// src/schema/pagination.schema.ts
import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.preprocess( // Preprocess string to number
    (val) => parseInt(z.string().parse(val), 10),
    z.number().int().positive("Page must be a positive integer").default(1)
  ),
  pageSize: z.preprocess( // Preprocess string to number
    (val) => parseInt(z.string().parse(val), 10),
    z.number().int().positive("Page size must be a positive integer").max(100, "Page size cannot exceed 100").default(10) // Max limit for safety
  ),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
```

**2. Create a Controller for Fetching Users**

Implement the controller function that will handle the pagination logic using Prisma.

```typescript
// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { PaginationQuery } from '../schema/pagination.schema'; // Import the pagination schema type

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Zod validation middleware (assuming it adds validated data to req.query or similar)
    // We'll rely on the validate middleware handling errors.
    const { page, pageSize } = req.query as unknown as PaginationQuery; // Cast after validation

    // Calculate skip and take for Prisma
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch total count and paginated data concurrently
    const [totalItems, users] = await Promise.all([
      prisma.user.count(), // Get total number of users
      prisma.user.findMany({
        skip: skip,
        take: take,
        // Optionally add ordering
        orderBy: {
          createdAt: 'desc',
        },
        // Optionally select specific fields to avoid sending sensitive data
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          // Omit password!
        },
      }),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    // Respond with paginated data and metadata
    res.status(200).json({
      data: users,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize,
      },
    });

  } catch (error) {
    next(error); // Pass errors to error handling middleware
  }
};
```

**3. Add the Route and Apply Validation Middleware**

Add a new GET route for `/users` (or `/api/users` depending on your base path) and apply the validation middleware using the `paginationQuerySchema`.

If you are using the structured route definition (`src/routes/routes.ts`) from the previous example, add a new entry:

```typescript
// src/routes/routes.ts
import { RequestHandler } from 'express';
import { z } from 'zod';
// ... import other schemas and controllers
import { validate } from '../middleware/validate.middleware';
import { paginationQuerySchema } from '../schema/pagination.schema'; // Import pagination schema
import { getUsers } from '../controllers/user.controller'; // Import user controller
import { authenticateToken } from '../middleware/auth.middleware';


// Update your ApiRoute type to include query params in the request structure
export type ApiRoute = {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  summary: string;
  description?: string;
  tags: string[];
  request?: {
    params?: z.AnyZodObject;
    query?: z.AnyZodObject; // <-- Added query property
    body?: z.AnyZodObject;
    headers?: z.AnyZodObject;
  };
  responses: {
    [statusCode: number]: {
      description: string;
      schema?: z.AnyZodObject; // Define response schema for documentation
    };
  };
  middlewares?: RequestHandler[];
  handler: RequestHandler;
  security?: Array<{ [key: string]: string[] }>;
};


export const apiRoutes: ApiRoute[] = [
  // ... other routes (signup, login, protected)

  {
    method: 'get',
    path: '/users', // Example path
    summary: 'Get a list of users with pagination',
    tags: ['Users'], // New tag for user-related endpoints
    request: {
      query: paginationQuerySchema, // Validate query parameters
    },
    responses: {
      200: {
        description: 'A paginated list of users',
        schema: z.object({ // Define the expected response structure for documentation
          data: z.array(z.object({ // Assuming UserOutputSchema is not ideal for list view, define inline or create a new schema
            id: z.number().openapi({ description: 'User ID' }),
            email: z.string().email().openapi({ description: 'User email' }),
            createdAt: z.string().openapi({ description: 'Creation timestamp' }), // Represent Date as string in API schema
            updatedAt: z.string().openapi({ description: 'Last updated timestamp' }),
            // Exclude password from response schema
          })).openapi({ description: 'Array of user objects for the current page' }),
          pagination: z.object({
            totalItems: z.number().openapi({ description: 'Total number of items available' }),
            totalPages: z.number().openapi({ description: 'Total number of pages' }),
            currentPage: z.number().openapi({ description: 'Current page number' }),
            pageSize: z.number().openapi({ description: 'Number of items per page' }),
          }).openapi({ description: 'Pagination metadata' }),
        }).openapi('PaginatedUsersResponse'), // Register response structure for documentation
      },
      400: { description: 'Invalid pagination parameters' },
      // Optionally add authentication middleware if user list requires login
      // middlewares: [authenticateToken, validate(paginationQuerySchema)],
    },
    middlewares: [validate(paginationQuerySchema)], // Apply validation middleware for query params
    handler: getUsers, // Link to the controller
  },

  // ... rest of your routes
];

// If you are not using the structured route approach, add directly to your Express router:
/*
import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { paginationQuerySchema } from '../schema/pagination.schema';
import { getUsers } from '../controllers/user.controller';

const userRouter = Router();
userRouter.get('/', validate(paginationQuerySchema), getUsers);
// In your app.ts: app.use('/api/users', userRouter);
*/
```

*Note: If you followed the code-first Swagger generation, you'll also need to ensure the `validate` middleware correctly adds the parsed/validated query parameters to `req.query` for the controller to access them correctly. Zod's `.parse()` method returns the validated object, which you'd typically assign back.*

**4. Update Swagger Documentation (Optional but Recommended)**

If you are using the code-first Swagger generation with `@asteasolutions/zod-to-openapi`, ensure your generator script picks up the new route definition (`/users`), the `paginationQuerySchema`, and the `PaginatedUsersResponse` schema (defined inline in the route definition example above for simplicity, but you could also define it separately in `src/schema`). The script should automatically generate the documentation based on these definitions.

If you are still using `swagger-jsdoc`, you would add JSDoc comments like this to your route file:

```typescript
// Example JSDoc for swagger-jsdoc (if you are NOT using the code-first generator)

/**
 * @swagger
 * /users:
 * get:
 * summary: Get a paginated list of users
 * tags: [Users]
 * parameters:
 * - in: query
 * name: page
 * schema:
 * type: integer
 * default: 1
 * minimum: 1
 * description: Page number
 * - in: query
 * name: pageSize
 * schema:
 * type: integer
 * default: 10
 * minimum: 1
 * maximum: 100
 * description: Number of items per page
 * responses:
 * 200:
 * description: A paginated list of users
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * type: array
 * items:
 * $ref: '#/components/schemas/UserOutput' # Reference your User output schema
 * pagination:
 * type: object
 * properties:
 * totalItems:
 * type: integer
 * totalPages:
 * type: integer
 * currentPage:
 * type: integer
 * pageSize:
 * type: integer
 * 400:
 * description: Invalid pagination parameters
 */
```

This example provides a standard way to implement simple offset-based pagination using Prisma's `skip` and `take`, validated by Zod, and documented using Swagger. Remember to adjust schema definitions and logic based on your specific `User` model and desired API response format.

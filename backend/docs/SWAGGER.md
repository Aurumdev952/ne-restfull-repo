The `options.definition` object is the core of your API documentation. It's a large JavaScript object that maps directly to the OpenAPI Specification JSON/YAML structure.

Here are the key sections you'll use to define your API, schemas, and security:

```typescript
export const options: Options = {
  definition: {
    openapi: "3.0.0", // Specifies the OpenAPI version
    info: {
      // API general information
    },
    servers: [
      // Array of server URLs
    ],
    paths: {
      // Your API endpoints
    },
    components: {
      // Reusable definitions (schemas, responses, security schemes, etc.)
    },
    security: [
      // Global security requirements
    ],
    // Other potential top-level objects like tags, externalDocs, etc.
  },
  // apis: [], // If using definition, apis might be empty or point only to separate schema files
};
```

Let's break down the main sections:

### 1\. `info` Object (API General Information)

This provides metadata about your API.

  * `title` (Required): The title of the API.
  * `version` (Required): The version of the API (e.g., "1.0.0").
  * `description` (Optional): A brief description of the API.
  * `contact` (Optional): Information about the API maintainers.
  * `license` (Optional): License information.

<!-- end list -->

```typescript
info: {
  title: "Backend API",
  version: "1.0.0",
  description: "API documentation for Backend API with user authentication",
  contact: {
    name: "Your Name or Team",
    email: "your.email@example.com",
    url: "http://your-website.com",
  },
  license: {
    name: "Apache 2.0",
    url: "http://www.apache.org/licenses/LICENSE-2.0.html",
  },
},
```

### 2\. `servers` Array (Base URLs)

An array of objects defining the base URLs for your API. Useful for distinguishing between development, staging, and production environments.

  * `url` (Required): The base URL for this server.
  * `description` (Optional): A description of the server.
  * `variables` (Optional): Template variables for the URL (more advanced).

<!-- end list -->

```typescript
servers: [
  {
    url: `http://localhost:${port}/api/v1`, // Using a variable from your config
    description: "Development server",
  },
  // You could add more servers here, e.g.:
  // {
  //   url: "https://api.yourproduction.com/v1",
  //   description: "Production server",
  // }
],
```

### 3\. `paths` Object (API Endpoints)

This is where you define each individual API endpoint. The keys of this object are the paths (e.g., `/auth/signup`, `/users/{userId}`). The value for each path is an object defining the operations (HTTP methods) available for that path.

Under each path, the keys are the lowercase HTTP methods (e.g., `get`, `post`, `put`, `delete`, `patch`). The value for each method is an object describing that specific operation.

An operation object includes:

  * `summary` (Optional): A brief summary of the operation.
  * `description` (Optional): A detailed description of the operation.
  * `tags` (Optional): An array of strings used to group operations in the documentation UI.
  * `parameters` (Optional): An array of parameters for the operation (path parameters, query parameters, header parameters, cookie parameters).
  * `requestBody` (Optional): Describes the expected request body.
  * `responses` (Required): Describes the possible responses from the operation, keyed by HTTP status code.
  * `security` (Optional): Overrides the global security requirement for this specific operation (explained later).

**Example (`/auth/signup` and `/auth/login`):**

```typescript
paths: {
  "/auth/signup": {
    post: { // POST method for this path
      summary: "Register a new user",
      tags: ["Auth"], // Grouping tag
      requestBody: {
        required: true,
        content: {
          "application/json": { // Content type
            schema: {
              $ref: "#/components/schemas/SignupInput", // Reference a reusable schema
            },
          },
        },
      },
      responses: { // Possible responses
        "201": { // HTTP status code
          description: "User created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    description: "JWT authentication token",
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid input",
        },
        "409": {
          description: "User already exists",
        },
      },
    },
  },
  "/auth/login": {
    post: { // POST method for this path
      summary: "Login a user",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginInput",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Successful login",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    description: "JWT authentication token",
                  },
                },
              },
            },
          },
        },
        "401": {
          description: "Invalid credentials",
        },
      },
    },
  },
  // Example with a path parameter
  "/users/{userId}": {
      get: {
          summary: "Get user by ID",
          tags: ["Users"],
          parameters: [ // Define path parameters
              {
                  name: "userId",
                  in: "path", // Parameter location (path, query, header, cookie)
                  required: true,
                  schema: {
                      type: "string" // Or integer, etc.
                  },
                  description: "ID of the user to retrieve"
              }
          ],
          responses: {
              "200": {
                  description: "User details",
                  content: {
                      "application/json": {
                          schema: {
                              $ref: "#/components/schemas/UserObject" // Reference another schema
                          }
                      }
                  }
              },
              "404": {
                  description: "User not found"
              }
          },
          security: [ // Apply security just to this operation
              {
                  bearerAuth: [] // Requires bearerAuth for this GET request
              }
          ]
      }
  }
},
```

### 4\. `components` Object (Reusable Definitions)

This object holds reusable definitions for various aspects of your OpenAPI specification. The most common ones you'll use are:

  * `schemas`: Reusable definitions for data structures (request/response bodies).
  * `responses`: Reusable response objects.
  * `parameters`: Reusable parameter definitions.
  * `securitySchemes`: Reusable security scheme definitions.

**a) `components.schemas` (Data Structures)**

Define the shape of your request and response bodies here. You can then reference them using `$ref`.

  * Each key under `schemas` is the name of your schema (e.g., `SignupInput`, `LoginInput`, `UserObject`).
  * The value is a Schema Object, which follows a specific structure (type, properties, required, format, etc.).

<!-- end list -->

```typescript
components: {
  schemas: {
    SignupInput: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          format: "email",
          description: "User's email address",
        },
        password: {
          type: "string",
          minlength: 6,
          description: "User's password (minimum 6 characters)",
        },
      },
    },
    LoginInput: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          format: "email",
          description: "User's email address",
        },
        password: {
          type: "string",
          description: "User's password",
        },
      },
    },
    // Example of another schema
    UserObject: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "User ID"
            },
            email: {
                type: "string",
                format: "email",
                description: "User's email"
            },
            createdAt: {
                type: "string",
                format: "date-time",
                description: "User creation timestamp"
            }
        }
    }
  },
  // ... other components like securitySchemes
},
```

**b) `components.securitySchemes` (Authentication Methods)**

Define how clients authenticate with your API. Each key is a logical name for the security scheme (e.g., `bearerAuth`, `apiKey`, `basicAuth`).

For JWT Bearer tokens, you typically use `type: http` and `scheme: bearer`.

```typescript
components: {
  // ... schemas
  securitySchemes: {
    bearerAuth: { // Logical name for this scheme
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT", // Optional, but good practice
      description: "JWT Authorization header using the Bearer scheme. Example: 'Authorization: Bearer your-token-here'"
    },
    // Example of an API Key scheme
    // apiKeyAuth: {
    //     type: "apiKey",
    //     in: "header", // Location of the API key (query, header, cookie)
    //     name: "X-API-Key", // The name of the header, query parameter, or cookie
    //     description: "API Key for accessing this endpoint"
    // }
  },
},
```

### 5\. `security` (Applying Security)

This array specifies the security schemes that must be used for the API. It's an array of security requirement objects.

A security requirement object is an object where the keys are the names of the security schemes defined in `components.securitySchemes`. The value is an array of scope names (empty for most common schemes like Bearer or API Key).

**a) Global Security:**

Add a `security` array at the top level of the `definition` object to apply security to *all* operations by default.

```typescript
definition: {
  // ... info, servers, paths, components
  security: [
    {
      bearerAuth: [], // Requires bearerAuth for all operations unless overridden
    },
    // You could combine requirements (AND condition)
    // {
    //    bearerAuth: [],
    //    apiKeyAuth: []
    // }
    // Or list alternative requirements (OR condition - implicitly by adding more objects to the array)
    // { bearerAuth: [] },
    // { apiKeyAuth: [] }
  ],
},
```

**b) Operation-Specific Security:**

You can override the global security or define security only for specific operations by adding a `security` array within a path operation object (e.g., inside `post` or `get`).

An empty `security: []` array on an operation means that operation has NO security requirements, even if global security is defined.

```typescript
paths: {
  "/auth/login": {
    post: {
      // ... other properties
      security: [], // This operation has no security requirement, even if global security is set
    }
  },
  "/protected/resource": {
    get: {
      // ... other properties
      security: [ // This operation requires bearerAuth
        {
          bearerAuth: []
        }
      ]
    }
  }
}
```

By defining your API structure directly in the `options.definition` object, you gain more control and avoid the potential pitfalls of JSDoc parsing inconsistencies. Remember to regenerate your documentation after making changes to this object.

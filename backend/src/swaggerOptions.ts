import { Options } from "swagger-jsdoc";
import { port } from "./config";

export const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API",
      version: "1.0.0",
      description: "API documentation for Backend API with user authentication",
    },
    externalDocs: {
      // <<< this will add the link to your swagger page
      description: "swagger.json", // <<< link title
      url: "/swagger.json", // <<< and the file added below in app.get(...)
    },
    servers: [
      {
        url: `http://localhost:${port}/api/v1`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT Authorization header using the Bearer scheme. Example: 'Authorization: Bearer your-token-here'",
        },
      },
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
        CreateItemInput: {
          type: "object",
          required: ["name", "price"],
          properties: {
            name: {
              type: "string",
            },
            price: {
              type: "string",
            },
          },
        },
        UpdateItemInput: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            price: {
              type: "string",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],

    paths: {
      "/auth/signup": {
        post: {
          summary: "Register a new user",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SignupInput",
                },
              },
            },
          },
          responses: {
            "201": {
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
          security: [],
        },
      },
      "/auth/login": {
        post: {
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
          security: [],
        },
      },
      "/auth/profile": {
        get: {
          summary: "get current user profile",
          tags: ["Auth"],
          responses: {
            "401": {
              description: "Invalid credentials",
            },
          },
        },
      },
      "/item": {
        get: {
          summary: "get items",
          tags: ["Item"],
          parameters: [
            {
              in: "query",
              name: "page",
              schema: {
                type: "integer",
                minimum: 1,
                default: 1,
              },
              description: "Page number for pagination",
              required: false,
            },
            {
              in: "query",
              name: "limit",
              schema: {
                type: "integer",
                minimum: 1,
                default: 10,
              },
              description: "Number of items per page",
              required: false,
            },
          ],
          responses: {
            "401": {
              description: "Invalid credentials",
            },
          },
        },
        put: {
          summary: "create item",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateItemInput",
                },
              },
            },
          },
          tags: ["Item"],
          responses: {
            "401": {
              description: "Invalid credentials",
            },
          },
        },
      },
      "/item/{id}": {
        get: {
          summary: "get item",
          tags: ["Item"],
          parameters: [
            {
              in: "path", // Specify that this is a path parameter
              name: "id", // The name must match the parameter in the path ({id})
              schema: {
                type: "uuid", // Or "string", "uuid", etc., depending on your ID type
              },
              required: true, // Path parameters are typically required
              description: "ID of the item to retrieve",
            },
          ],
          responses: {
            "401": {
              description: "Invalid credentials",
            },
          },
        },
        put: {
          summary: "update item",
          parameters: [
            {
              in: "path", // Specify that this is a path parameter
              name: "id", // The name must match the parameter in the path ({id})
              schema: {
                type: "uuid", // Or "string", "uuid", etc., depending on your ID type
              },
              required: true, // Path parameters are typically required
              description: "ID of the item to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateItemInput",
                },
              },
            },
          },
          tags: ["Item"],
          responses: {
            "401": {
              description: "Invalid credentials",
            },
          },
        },
        delete: {
          summary: "delete item",
          tags: ["Item"],
          responses: {
            "401": {
              description: "Invalid credentials",
            },
          },
          parameters: [
            {
              in: "path", // Specify that this is a path parameter
              name: "id", // The name must match the parameter in the path ({id})
              schema: {
                type: "uuid", // Or "string", "uuid", etc., depending on your ID type
              },
              required: true, // Path parameters are typically required
              description: "ID of the item to retrieve",
            },
          ],
        },
      },
      // "/users/profile": {
      //   get: {
      //     summary: "Get user profile",
      //     tags: ["Users"],
      //     responses: {
      //       "200": {
      //         description: "User profile details",
      //         // Define response schema
      //       },
      //       "401": {
      //         description: "Unauthorized",
      //       },
      //     },
      // No 'security' property here, so it uses the global 'bearerAuth' requirement
      // },
      // },
    },
  },
  apis: [],
};

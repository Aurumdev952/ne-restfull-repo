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
    externalDocs: {                // <<< this will add the link to your swagger page
      description: "swagger.json", // <<< link title
      url: "/swagger.json"         // <<< and the file added below in app.get(...)
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

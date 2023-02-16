const swaggerAutogen = require('swagger-autogen')();
const doc = {
  info: {
    version: '1.0.0', // by default: '1.0.0'
    title: 'Project Name Title', // by default: 'REST API'
    description:
      "This is the Auth general service where admin and customer api's can be used as a base project structure", // by default: ''
  },

  host: '', // by default: 'localhost:3000'
  basePath: '', // by default: '/'
  schemes: ['https'], // by default: ['http']
  consumes: ['application/json'], // by default: ['application/json']
  produces: ['application/json'], // by default: ['application/json']
  tags: [
    // by default: empty Array
    {
      name: 'admin', // Tag name
      description: 'Admin Panel', // Tag description
    },
    {
      name: 'customers', // Tag name
      description: '', // Tag description
    },
    {
      name: 'customer address', // Tag name
      description: 'CRUD for address of customer', // Tag description
    },
    {
      name: 'country', // Tag name
      description: 'CRUD for country', // Tag description
    },
    {
      name: 'state', // Tag name
      description: 'CRUD for state', // Tag description
    },
    {
      name: 'city', // Tag name
      description: 'CRUD for city', // Tag description
    },
    // { ... }
  ],
  securityDefinitions: {
    api_key: {
      type: 'apiKey',
      name: 'api_key',
      in: 'header',
    },
  },
  security: {
    apiKey: [],
  },
  // by default: empty object
  definitions: {}, // by default: empty object (Swagger 2.0)
  components: {}, // by default: empty object (OpenAPI 3.x)
};

const outputFile = './src/swagger.json';
const endpointsFiles = ['./src/app.ts'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);

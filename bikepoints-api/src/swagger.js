const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BikePoints API',
            version: '1.0.0',
            description: 'API para controlar a pontuação da corrida de bicicleta'
        },
        servers: [
            {
                url: 'https://SUA-API-NO-RENDER.onrender.com'
            }
        ]
    },
    apis: ['./src/server.js']
};

module.exports = swaggerJsdoc(options);
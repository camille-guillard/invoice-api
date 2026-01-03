import { Router } from 'express';

export function createClientRoutes(clientController) {
  const router = Router();

  /**
   * @swagger
   * /api/clients:
   *   get:
   *     summary: Get all clients
   *     tags: [Clients]
   *     responses:
   *       200:
   *         description: List of all clients
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     example: client-1
   *                   name:
   *                     type: string
   *                     example: ACME Corp
   *                   email:
   *                     type: string
   *                     example: contact@acmecorp.com
   *                   address:
   *                     type: string
   *                     example: 123 Innovation Drive, San Francisco, CA 94105
   */
  router.get('/clients', (req, res) => clientController.getAllClients(req, res));

  /**
   * @swagger
   * /api/clients/{id}:
   *   get:
   *     summary: Get a client by ID
   *     tags: [Clients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The client ID
   *     responses:
   *       200:
   *         description: Client details
   *       404:
   *         description: Client not found
   */
  router.get('/clients/:id', (req, res) => clientController.getClientById(req, res));

  return router;
}

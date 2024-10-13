/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the role.
 *         description:
 *           type: string
 *           description: A brief description of the role.
 *       required:
 *         - description
 */
export class Role {
  id?: number;
  description?: string;
}
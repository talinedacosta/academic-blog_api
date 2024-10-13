/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user.
 *         password:
 *           type: string
 *           description: The password for the user account. (Should be handled securely)
 *         role_id:
 *           type: integer
 *           description: The ID of the role assigned to the user.
 *       required:
 *         - name
 *         - email
 *         - password
 */
export class User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role_id?: number;

  constructor(name: string, email: string, password: string, role_id?: number) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.role_id = role_id;
  }
}
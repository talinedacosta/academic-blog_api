import { app } from "@/app";
import { database } from "@/lib/pg/db";
import request from "supertest";

describe("User controller", () => {
  const newUser = {
    name: "Tester user",
    email: "tester@tester.com",
    password: "123456",
    role_id: 1,
  };

  let token: string;

  beforeAll(async () => {
    await database.connection();
    await database.testConnection();
  });

  afterAll(async () => {
    await database.releaseConnection();
    await database.closePool();
  });

  it("should create a user", async () => {
    await database.clientInstance.query(`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE`);
    await database.clientInstance.query(`TRUNCATE TABLE "post" RESTART IDENTITY CASCADE`);

    const response = await request(app).post("/user").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });

  it("should not create a user with the same email", async () => {
    const response = await request(app).post("/user").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("This email has already been used");
  });

  it("should login a user", async () => {
    const userCredentials = {
      email: newUser.email,
      password: newUser.password
    };

    const response = await request(app).post("/user/login").send(userCredentials);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.name).toBe(newUser.name);
    expect(response.body.user.email).toBe(newUser.email);
    expect(response.body.user.role_id).toBe(newUser.role_id);    

    token = response.body.token;
  });

  it("should not login a user with wrong password", async () => {
    const userCredentials = {
      email: newUser.email,
      password: "wrong-password"
    };

    const response = await request(app).post("/user/login").send(userCredentials);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Password incorrect");
  });

  it("should find a user by id", async () => {
    const response = await request(app).get("/user/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.role_id).toBe(newUser.role_id);
    expect(response.body).toHaveProperty("created_at");
  });

  it("should remove a user", async () => {
    const response = await request(app).delete("/user/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
  
});

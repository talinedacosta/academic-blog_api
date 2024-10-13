import { app } from "@/app";
import { database } from "@/lib/pg/db";
import request from "supertest";

describe("Post controller", () => {
  const newTeacherUser = {
    name: "Tester user",
    email: "tester@tester.com",
    password: "123456",
    role_id: 1,
  };
  
  const newStudentUser = {
    name: "Tester user student",
    email: "testerstudent@testerstudent.com",
    password: "123456",
    role_id: 2,
  };

  const newPost = {
    title: "Test post",
    content: "Test content",
  };

  let tokenTeacher: string;
  let tokenStudent: string;
  let loggedTeacherId: number;

  beforeAll(async () => {
    await database.connection();
    await database.testConnection();

    await database.clientInstance.query(`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE`);
    await request(app).post("/user").send(newTeacherUser);
    const loginTeacherResponse = await request(app).post("/user/login").send({ email: newTeacherUser.email, password: newTeacherUser.password });

    tokenTeacher = loginTeacherResponse.body.token;
    loggedTeacherId = loginTeacherResponse.body.user.id;
    
    await request(app).post("/user").send(newStudentUser);
    const loginStudentResponse = await request(app).post("/user/login").send({ email: newStudentUser.email, password: newStudentUser.password });

    tokenStudent = loginStudentResponse.body.token;   
  });

  afterAll(async () => {
    await database.releaseConnection();
    await database.closePool();
  });

  it("should create a post ", async () => {
    const response = await request(app).post("/posts").set('Authorization', `Bearer ${tokenTeacher}`).send(newPost);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("created_at");
    expect(response.body.title).toBe(newPost.title);
    expect(response.body.content).toBe(newPost.content);
    expect(response.body.created_by).toBe(loggedTeacherId);
  });
  
  it("should not create a post with a student user", async () => {
    const response = await request(app).post("/posts").set('Authorization', `Bearer ${tokenStudent}`).send(newPost);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should not create a post without a token", async () => {
    const response = await request(app).post("/posts").send(newPost);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Token not provided");
  });

  it("should update a post", async () => {
    const postResponse = await request(app).post("/posts").set('Authorization', `Bearer ${tokenTeacher}`).send(newPost);

    const updatedPost = {
      title: "Updated post",
      content: "Updated content",
    };

    const response = await request(app).put(`/posts/${postResponse.body.id}`).set('Authorization', `Bearer ${tokenTeacher}`).send(updatedPost);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("created_at");
    expect(response.body).toHaveProperty("updated_at");
    expect(response.body.title).toBe(updatedPost.title);
    expect(response.body.content).toBe(updatedPost.content);
    expect(response.body.created_by).toBe(loggedTeacherId);
  });

  it("should not update a post with a student user", async () => {
    const postResponse = await request(app).post("/posts").set('Authorization', `Bearer ${tokenTeacher}`).send(newPost);

    const updatedPost = {
      title: "Updated post",
      content: "Updated content",
    };

    const response = await request(app).put(`/posts/${postResponse.body.id}`).set('Authorization', `Bearer ${tokenStudent}`).send(updatedPost);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should not update a post without a token", async () => {
    const response = await request(app).put("/posts/1").send(newPost);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Token not provided");
  });

  it("should delete a post", async () => {
    const postResponse = await request(app).post("/posts").set('Authorization', `Bearer ${tokenTeacher}`).send(newPost);

    const response = await request(app).delete(`/posts/${postResponse.body.id}`).set('Authorization', `Bearer ${tokenTeacher}`);

    expect(response.status).toBe(204);
  });

  it("should not delete a post with a student user", async () => {
    const postResponse = await request(app).post("/posts").set('Authorization', `Bearer ${tokenTeacher}`).send(newPost);

    const response = await request(app).delete(`/posts/${postResponse.body.id}`).set('Authorization', `Bearer ${tokenStudent}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should not delete a post without a token", async () => {
    const response = await request(app).delete("/posts/1");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Token not provided");
  });

  it("should find all posts", async () => {
    const postResponse1 = await request(app).post("/posts").set('Authorization', `Bearer ${tokenTeacher}`).send(newPost);
    const postResponse2 = await request(app).post("/posts").set('Authorization', `Bearer ${tokenTeacher}`).send(newPost);

    const response = await request(app).get("/posts");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should find a post by id", async () => {
    const postResponse = await request(app).post("/posts").set('Authorization', `Bearer ${tokenTeacher}`).send(newPost);

    const response = await request(app).get(`/posts/${postResponse.body.id}`).set('Authorization', `Bearer ${tokenTeacher}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(postResponse.body.id);
    expect(response.body.title).toBe(newPost.title);
    expect(response.body.content).toBe(newPost.content);
  });
});

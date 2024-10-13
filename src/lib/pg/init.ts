export const databaseInitialQuery = `
CREATE TABLE IF NOT EXISTS role(
    id SERIAL NOT NULL,
    description varchar(50) NOT NULL,
    PRIMARY KEY(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS roles_role_name_key ON role USING btree ("description");
INSERT INTO role(description) VALUES('teacher') ON CONFLICT (description) DO NOTHING;
INSERT INTO role(description) VALUES('student') ON CONFLICT (description) DO NOTHING;

CREATE TABLE IF NOT EXISTS "user"(
    id SERIAL NOT NULL,
    email varchar(50) NOT NULL,
    password varchar(100) NOT NULL,
    role_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    name varchar(200) NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT users_role_id_fkey FOREIGN key(role_id) REFERENCES role(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS users_username_key ON "user" USING btree ("email");
INSERT INTO "user"(email,password,role_id,name) VALUES('estudante_caroline@fiap.com','$2b$10$zplVUaNTisFOG1iB1ftntOWW2yEjtVja90yVjgYUd.PZdiukujU8q',2,'Caroline Fernandes') ON CONFLICT (email) DO NOTHING;
INSERT INTO "user"(email,password,role_id,name) VALUES('professor_luiza@fiap.com','$2b$10$zplVUaNTisFOG1iB1ftntOWW2yEjtVja90yVjgYUd.PZdiukujU8q',1,'Luiza Maria') ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS post(
    id SERIAL NOT NULL,
    title varchar(500) NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer NOT NULL,
    updated_by integer,
    PRIMARY KEY(id),
    CONSTRAINT posts_created_by_fkey FOREIGN key(created_by) REFERENCES "user"(id),
    CONSTRAINT posts_updated_by_fkey FOREIGN key(updated_by) REFERENCES "user"(id)
);
`;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE classrooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tutor_id INTEGER REFERENCES users(id)
);

CREATE TABLE enrollments (
    class_id INTEGER REFERENCES classrooms(id),
    student_id INTEGER REFERENCES users(id),
    PRIMARY KEY (class_id, student_id)
);

CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES classrooms(id),
    file_name VARCHAR(255) NOT NULL,
    file_description TEXT,
    file_type VARCHAR(50) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INTEGER NOT NULL REFERENCES users(id),
    deleted BOOLEAN DEFAULT FALSE
);


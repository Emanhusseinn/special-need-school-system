// src/LoginPage.js
import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Check if the credentials match the hardcoded values
    if (username === "admin" && password === "schooladmin123") {
      onLogin(); // Trigger the login action
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <h2>تسجيل الدخول</h2>
      <Form onSubmit={handleLogin} className="w-50 mt-3">
        <Form.Group controlId="username">
          <Form.Label>اسم المستخدم</Form.Label>
          <Form.Control
            type="text"
            placeholder="أدخل اسم المستخدم"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password" className="mt-2">
          <Form.Label>كلمة المرور</Form.Label>
          <Form.Control
            type="password"
            placeholder="أدخل كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        {error && <p className="text-danger mt-2">{error}</p>}
        <Button type="submit" className="mt-3">دخول</Button>
      </Form>
    </Container>
  );
};

export default LoginPage;

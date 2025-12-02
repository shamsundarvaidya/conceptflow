import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Stack,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
} from "@mantine/core";
import { Link } from "react-router";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("REGISTER:", { name, email, password });
  }

  return (
    <Box
      component="main"
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        padding: "3rem 1.5rem",
        background:
          "radial-gradient(circle at 0% 0%, rgba(129,140,248,0.35), transparent 55%)," +
          "radial-gradient(circle at 100% 0%, rgba(45,212,191,0.35), transparent 55%)," +
          "radial-gradient(circle at 0% 100%, rgba(248,113,113,0.25), transparent 55%)," +
          "radial-gradient(circle at 100% 100%, rgba(56,189,248,0.25), transparent 55%)," +
          "linear-gradient(135deg, #020617, #020617)",
      }}
    >
      {/* background blobs */}
      <Box
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <Box
          style={{
            position: "absolute",
            top: "-80px",
            left: "10%",
            width: "220px",
            height: "220px",
            borderRadius: "999px",
            background: "rgba(129,140,248,0.4)",
            filter: "blur(60px)",
            opacity: 0.6,
          }}
        />
        <Box
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "12%",
            width: "260px",
            height: "260px",
            borderRadius: "999px",
            background: "rgba(45,212,191,0.45)",
            filter: "blur(70px)",
            opacity: 0.6,
          }}
        />
      </Box>

      <Container
        size="xs"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
        }}
      >
        <Paper
          radius="xl"
          p="xl"
          shadow="xl"
          withBorder
          style={{
            width: "100%",
            borderColor: "rgba(148,163,184,0.4)",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.96))",
            backdropFilter: "blur(18px)",
          }}
        >
          <Stack gap="sm">
            <Title order={2} c="gray.0">
              Create your account
            </Title>
            <Text c="dimmed" fz="sm">
              Start turning your ideas into living maps with ConceptFlow.
            </Text>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack mt="md" gap="sm">
              <TextInput
                label="Name"
                placeholder="Your name"
                required
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />

              <TextInput
                label="Email"
                placeholder="you@example.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />

              <PasswordInput
                label="Password"
                placeholder="Create a password"
                required
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />

              <Button type="submit" fullWidth mt="sm">
                Create account
              </Button>

              <Text c="dimmed" fz="xs" ta="center" mt="xs">
                Already have an account?{" "}
                <Anchor component={Link} to="/login" fz="xs">
                  Login
                </Anchor>
              </Text>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

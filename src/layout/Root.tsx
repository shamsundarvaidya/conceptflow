import { Outlet, Link, useNavigate } from "react-router";
import { ConceptFlowLogo } from "../components/ConceptFlowLogo";
import {
  AppShell,
  Container,
  Group,
  Button,
  Title,
} from "@mantine/core";
import { UserMenu } from "../components/UserMenu";
import { useAuthStore } from "../stores/authStore";

export default function Root() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <AppShell
      header={{ height: 60 }}         // New Mantine v7 syntax
      padding="md"
    >
      <AppShell.Header
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(129,140,248,0.35), transparent 55%)," +
            "radial-gradient(circle at 100% 0%, rgba(45,212,191,0.35), transparent 55%)," +
            "linear-gradient(135deg, #020617, #020617)",
          backdropFilter: "blur(12px)",            // 🔥 glass effect
          borderBottom: "1px solid rgba(148,163,184,0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* subtle blurred blobs inside header */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            left: "20%",
            width: "120px",
            height: "120px",
            borderRadius: "999px",
            background: "rgba(129,140,248,0.4)",
            filter: "blur(40px)",
            opacity: 0.45,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "15%",
            width: "150px",
            height: "150px",
            borderRadius: "999px",
            background: "rgba(45,212,191,0.35)",
            filter: "blur(50px)",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        >
        </div>
        <Container
          size="lg"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Title
            order={3}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <ConceptFlowLogo />
          </Title>

          <Group>
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Button variant="subtle" component={Link} to="/login">
                  Login
                </Button>
                <Button component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main
        style={{
          minHeight: "calc(100vh - var(--app-shell-header-height))",
          display: "flex",          // ✅ flex container
          flexDirection: "column",  // child can flex: 1
          overflow: "hidden",
          padding: 0,
        }}>

        <Outlet />

      </AppShell.Main>
    </AppShell>
  );
}

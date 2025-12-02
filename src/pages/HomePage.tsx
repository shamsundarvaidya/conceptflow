import {
  Box,
  Container,
  Paper,
  Stack,
  Title,
  Text,
  Badge,
  Group,
  Divider,
} from "@mantine/core";

export default function HomePage() {
  return (
    <Box
      component="main"
      // Full viewport height, abstract layered background
      style={{
        minHeight: "calc(100vh - var(--mantine-header-height))",
        position: "relative",
        flex: 1,
        overflow: "hidden",
        padding: "4rem 0 5rem",
        background:
          "radial-gradient(circle at 0% 0%, rgba(129,140,248,0.35), transparent 55%)," +
          "radial-gradient(circle at 100% 0%, rgba(45,212,191,0.35), transparent 55%)," +
          "radial-gradient(circle at 0% 100%, rgba(248,113,113,0.25), transparent 55%)," +
          "radial-gradient(circle at 100% 100%, rgba(56,189,248,0.25), transparent 55%)," +
          "linear-gradient(135deg, #020617, #020617)", // base slate background
      }}
    >
      {/* floating blurred blobs (pure decoration) */}
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
            background: "rgba(129,140,248,0.5)",
            filter: "blur(60px)",
            opacity: 0.6,
          }}
        />
        <Box
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "15%",
            width: "260px",
            height: "260px",
            borderRadius: "999px",
            background: "rgba(45,212,191,0.45)",
            filter: "blur(70px)",
            opacity: 0.6,
          }}
        />
        <Box
          style={{
            position: "absolute",
            top: "40%",
            left: "-80px",
            width: "200px",
            height: "200px",
            borderRadius: "999px",
            background: "rgba(248,250,252,0.18)",
            filter: "blur(70px)",
            opacity: 0.5,
          }}
        />
      </Box>

      <Container
        size="lg"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* glass hero card */}
        <Paper
          radius="xl"
          p="xl"
          shadow="xl"
          withBorder
          style={{
            maxWidth: 720,
            marginInline: "auto",
            borderColor: "rgba(148,163,184,0.4)",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.88), rgba(15,23,42,0.96))",
            backdropFilter: "blur(18px)",
          }}
        >
          <Stack gap="md">
            <Badge
              variant="gradient"
              gradient={{ from: "indigo", to: "teal" }}
              radius="xl"
              size="lg"
              style={{ alignSelf: "flex-start" }}
            >
              Mind-mapping for deep thinking
            </Badge>

            <Title
              order={1}
              style={{
                fontSize: "2.6rem",
                lineHeight: 1.1,
                color: "#e5e7eb",
              }}
            >
              See your ideas as a living map, not a static document.
            </Title>

            <Text c="dimmed" fz="sm">
              ConceptFlow is a canvas for complex thinking. Drop nodes, connect
              concepts, and zoom through your thoughts like a constellation of
              ideas. Perfect for product design, studying, writing, or planning
              your next project.
            </Text>

            <Group gap="lg" mt="sm">
              <Stack gap={2}>
                <Text fw={600} fz="sm" c="gray.1">
                  Infinite canvas
                </Text>
                <Text c="dimmed" fz="xs">
                  Pan and zoom smoothly, expand branches as you think, and never
                  run out of space.
                </Text>
              </Stack>

              <Stack gap={2}>
                <Text fw={600} fz="sm" c="gray.1">
                  Visual structure
                </Text>
                <Text c="dimmed" fz="xs">
                  Group related concepts, highlight flows, and turn chaos into a
                  shape you can actually reason about.
                </Text>
              </Stack>
            </Group>

            <Divider
              my="md"
              style={{ borderColor: "rgba(51,65,85,0.9)" }}
            />

            <Group gap="lg" align="flex-start">
              <Stack gap={4}>
                <Text fw={600} fz="xs" c="gray.3" tt="uppercase" >
                  Built for
                </Text>
                <Text c="gray.2" fz="xs">
                  • System & architecture diagrams
                  <br />
                  • Study maps & exam prep
                  <br />
                  • Writing & story outlines
                  <br />
                  • Product roadmaps & strategy
                </Text>
              </Stack>

              <Stack gap={4}>
                <Text fw={600} fz="xs" c="gray.3" tt="uppercase" >
                  Coming soon
                </Text>
                <Text c="gray.2" fz="xs">
                  Collaboration, comments, templates, and AI-assisted
                  exploration of your own maps.
                </Text>
              </Stack>
            </Group>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

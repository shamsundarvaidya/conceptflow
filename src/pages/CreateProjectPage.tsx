import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Container,
  Title,
  Text,
  TextInput,
  Textarea,
  Select,
  SegmentedControl,
  ColorInput,
  Button,
  Group,
  Stack,
  Paper,
  Alert,
  SimpleGrid,
  Grid,
  ThemeIcon,
  Box,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconAlertCircle,
  IconCloud,
  IconDeviceFloppy,
  IconInfoCircle,
} from "@tabler/icons-react";
import type { ProjectType, StorageType, CreateProjectData } from "../types/project";
import { PROJECT_TYPES, STORAGE_OPTIONS, COLOR_SWATCHES } from "../constants/createProject";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("mindmap");
  const [storageType, setStorageType] = useState<StorageType>("cloud");
  const [color, setColor] = useState("#228be6");

  const selectedProjectType = PROJECT_TYPES.find((t) => t.value === projectType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    setLoading(true);
    setError(null);

    const projectData: CreateProjectData = {
      name: name.trim(),
      description: description.trim() || undefined,
      projectType,
      storageType,
      visibility: "private", // Defaulted as per user request (not required in UI)
      color,
    };

    try {
      const baseUrl = import.meta.env.VITE_API_URL ?? "";
      const res = await fetch(`${baseUrl}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create project");
      }

      navigate("/app/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={18} />}
        onClick={() => navigate("/app/projects")}
        mb="lg"
      >
        Back to Projects
      </Button>

      <Paper p={{ base: "md", sm: "xl" }} radius="md" withBorder>
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="lg">
              <div>
                <Title order={2} mb="xs">Create New Project</Title>
                <Text c="dimmed" size="sm">
                  Configure your new project settings below.
                </Text>
              </div>

              {error && (
                <Alert color="red" icon={<IconAlertCircle />} onClose={() => setError(null)} withCloseButton>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack gap="md">
                  <TextInput
                    label="Project Name"
                    placeholder="Enter project name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    size="md"
                  />

                  <Textarea
                    label="Description"
                    placeholder="Optional description for your project"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    minRows={3}
                    size="md"
                  />

                  <div>
                    <Text fw={500} size="sm" mb="xs">Project Type</Text>
                    <Select
                      data={PROJECT_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                      value={projectType}
                      onChange={(val) => val && setProjectType(val as ProjectType)}
                      size="md"
                      allowDeselect={false}
                      leftSection={selectedProjectType && <selectedProjectType.icon size={18} />}
                    />
                  </div>

                  <Box visibleFrom="xs">
                    <Text fw={500} size="sm" mb="xs">Storage</Text>
                    <SegmentedControl
                      fullWidth
                      data={STORAGE_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
                      value={storageType}
                      onChange={(val) => setStorageType(val as StorageType)}
                    />
                    <Text size="xs" c="dimmed" mt={4}>
                      {STORAGE_OPTIONS.find((s) => s.value === storageType)?.description}
                    </Text>
                  </Box>

                  <Box hiddenFrom="xs">
                    <Select
                      label="Storage"
                      data={STORAGE_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
                      value={storageType}
                      onChange={(val) => val && setStorageType(val as StorageType)}
                      size="md"
                    />
                  </Box>

                  <ColorInput
                    label="Project Color"
                    placeholder="Pick a color"
                    value={color}
                    onChange={setColor}
                    swatches={COLOR_SWATCHES}
                    size="md"
                  />

                  <Group justify="flex-end" mt="lg">
                    <Button
                      variant="default"
                      onClick={() => navigate("/app/projects")}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      leftSection={storageType === "cloud" ? <IconCloud size={18} /> : <IconDeviceFloppy size={18} />}
                    >
                      Create Project
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }} visibleFrom="md">
            <Stack gap="md" h="100%" justify="center">
              <Paper withBorder p="xl" radius="md" bg="var(--mantine-color-gray-0)">
                <Stack align="center" gap="md" ta="center">
                  <ThemeIcon size={64} radius="xl" variant="light" color="blue">
                    {selectedProjectType?.icon && (
                      <selectedProjectType.icon size={32} />
                    )}
                  </ThemeIcon>
                  <div>
                    <Text fw={700} size="xl">{selectedProjectType?.label}</Text>
                    <Text c="dimmed" size="sm" mt="xs">
                      {selectedProjectType?.description}
                    </Text>
                  </div>

                  <Alert icon={<IconInfoCircle size={16} />} title="Note" variant="light" color="blue" ta="left">
                    <Text size="xs">
                      You can change these settings later in the project configuration.
                    </Text>
                  </Alert>

                  {storageType === 'local' && (
                    <Alert color="orange" title="Local Storage" variant="light" ta="left">
                      <Text size="xs">
                        This project will be stored locally on this device. Clearing browser data may delete the project.
                      </Text>
                    </Alert>
                  )}
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
}

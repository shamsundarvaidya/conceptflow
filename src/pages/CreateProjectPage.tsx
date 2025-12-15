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
} from "@mantine/core";
import {
  IconArrowLeft,
  IconAlertCircle,
  IconCloud,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import type { ProjectType, StorageType, ProjectVisibility, CreateProjectData } from "../types/project";
import { PROJECT_TYPES, STORAGE_OPTIONS, VISIBILITY_OPTIONS, COLOR_SWATCHES } from "../constants/createProject";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("mindmap");
  const [storageType, setStorageType] = useState<StorageType>("cloud");
  const [visibility, setVisibility] = useState<ProjectVisibility>("private");
  const [color, setColor] = useState("#228be6");

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
      visibility,
      color,
    };

    try {
      const res = await fetch("/api/projects", {
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
    <Container size="md" py="xl">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={18} />}
        onClick={() => navigate("/app/projects")}
        mb="lg"
      >
        Back to Projects
      </Button>

      <Paper p={{ base: "md", sm: "xl" }} radius="md" withBorder>
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
                />
              </div>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <div>
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
                </div>

                <div>
                  <Text fw={500} size="sm" mb="xs">Visibility</Text>
                  <SegmentedControl
                    fullWidth
                    data={VISIBILITY_OPTIONS}
                    value={visibility}
                    onChange={(val) => setVisibility(val as ProjectVisibility)}
                  />
                </div>
              </SimpleGrid>

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
      </Paper>
    </Container>
  );
}

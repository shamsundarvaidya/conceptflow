import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
    Container,
    Title,
    Text,
    SimpleGrid,
    Button,
    Group,
    Stack,
    Loader,
    Alert
} from "@mantine/core";
import { IconFolderOpen, IconAlertCircle, IconPlus } from "@tabler/icons-react";
import { ProjectCard } from "../components/ProjectCard";
import type { Project } from "../types/project";

export default function ProjectsPage() {
    const navigate = useNavigate();
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch projects
    useEffect(() => {
        const fetchProjects = async () => {
            const baseUrl = import.meta.env.VITE_API_URL ?? "";
            try {
                setLoading(true);
                // Fetch Recent
                const recentRes = await fetch(`${baseUrl}/api/projects/recent`);
                if (!recentRes.ok) throw new Error("Failed to fetch recent projects");
                const recentData = await recentRes.json();
                setRecentProjects(recentData);

                // Fetch All
                const allRes = await fetch(`${baseUrl}/api/projects`);
                if (!allRes.ok) throw new Error("Failed to fetch project list");
                const allData = await allRes.json();
                setAllProjects(allData);

            } catch (err) {
                setError(err instanceof Error ? err.message : "Backend not responding!");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleOpenLocalClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        console.log("Opening local file:", file.name);
        // Here you would implement logic to read and parse the file
        alert(`Selected file: ${file.name}\n(Local file opening logic to be implemented)`);

        // Reset input
        event.target.value = "";
    };

    if (loading) {
        return (
            <Container size="lg" py="xl" style={{ display: 'flex', justifyContent: 'center' }}>
                <Loader size="xl" />
            </Container>
        );
    }

    return (
        <Container size="lg" py="xl">
            <Group justify="space-between" mb="xl">
                <Title order={2}>Projects</Title>
                <Group>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".json,.cflow" // Example extensions
                        onChange={handleFileChange}
                    />
                    <Button
                        leftSection={<IconFolderOpen size={18} />}
                        variant="default"
                        onClick={handleOpenLocalClick}
                    >
                        Open Local Project
                    </Button>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        onClick={() => navigate("/app/createproject")}
                    >
                        New Project
                    </Button>
                </Group>
            </Group>

            {error && (
                <Alert color="red" title="Error" icon={<IconAlertCircle />} mb="xl">
                    {error}
                </Alert>
            )}

            {/* Recent Section */}
            {recentProjects.length > 0 && (
                <Stack mb="xl">
                    <Title order={4} c="dimmed">Recent</Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                        {recentProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </SimpleGrid>
                </Stack>
            )}

            {/* All Projects Section */}
            <Title order={4} c="dimmed" mb="md">All Projects</Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                {allProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </SimpleGrid>

            {allProjects.length === 0 && !loading && !error && (
                <Text c="dimmed" ta="center" py="xl">No projects found. Create one to get started!</Text>
            )}
        </Container>
    );
}

import { Card, Text, Group, Badge, Button } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import type { Project } from "../types/project";
import { useNavigate } from "react-router";

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const navigate = useNavigate();

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
                <Text fw={500} truncate>{project.name}</Text>
                {project.isPinned && <Badge color="pink" variant="light">Pinned</Badge>}
            </Group>

            <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                {project.description || "No description provided."}
            </Text>

            <Group justify="space-between" mt="md" mb="xs">
                {project.lastOpenedAt && (
                    <Group gap={4}>
                        <IconClock size={14} color="gray" />
                        <Text size="xs" c="dimmed">
                            {new Date(project.lastOpenedAt).toLocaleDateString()}
                        </Text>
                    </Group>
                )}
            </Group>

            <Button
                variant="light"
                color="blue"
                fullWidth
                mt="md"
                radius="md"
                onClick={() => navigate(`/app/projects/${project.id}`)}
            >
                Open Project
            </Button>
        </Card>
    );
}

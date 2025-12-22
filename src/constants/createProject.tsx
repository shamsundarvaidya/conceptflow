import {
    IconMap,
    IconLayoutKanban,
    IconBrush,
    IconSchema,
    IconChalkboard,
} from "@tabler/icons-react";
import type { ProjectType, StorageType, ProjectVisibility } from "../types/project";

export const PROJECT_TYPES: { value: ProjectType; label: string; icon: React.ElementType; description: string }[] = [
    { value: "mindmap", label: "Mind Map", icon: IconMap, description: "Visualize your thoughts and ideas in a branching structure." },
    { value: "canvas", label: "Canvas Board", icon: IconBrush, description: "A freeform space for brainstorming and arranging elements." },
    { value: "kanban", label: "Kanban", icon: IconLayoutKanban, description: "Organize tasks and track progress using columns and cards." },
    { value: "flowchart", label: "Flowchart", icon: IconSchema, description: "Map out processes, workflows, and systems with diagrams." },
    { value: "whiteboard", label: "Whiteboard", icon: IconChalkboard, description: "A blank canvas for drawing, sketching, and collaborative ideation." },
];

export const STORAGE_OPTIONS: { value: StorageType; label: string; description: string }[] = [
    { value: "local", label: "Local", description: "Stored on your device" },
    { value: "cloud", label: "Cloud", description: "Synced across devices" },
];

export const VISIBILITY_OPTIONS: { value: ProjectVisibility; label: string }[] = [
    { value: "private", label: "Private" },
    { value: "public", label: "Public" },
];

export const COLOR_SWATCHES = [
    "#228be6", "#40c057", "#fab005", "#fa5252", "#7950f2",
    "#15aabf", "#fd7e14", "#e64980", "#82c91e", "#be4bdb",
];

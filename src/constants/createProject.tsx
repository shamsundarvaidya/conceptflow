import {
    IconMap,
    IconLayoutKanban,
    IconBrush,
    IconSchema,
    IconChalkboard,
} from "@tabler/icons-react";
import type { ProjectType, StorageType, ProjectVisibility } from "../types/project";

export const PROJECT_TYPES: { value: ProjectType; label: string; icon: React.ReactNode }[] = [
    { value: "mindmap", label: "Mind Map", icon: <IconMap size={18} /> },
    { value: "canvas", label: "Canvas Board", icon: <IconBrush size={18} /> },
    { value: "kanban", label: "Kanban", icon: <IconLayoutKanban size={18} /> },
    { value: "flowchart", label: "Flowchart", icon: <IconSchema size={18} /> },
    { value: "whiteboard", label: "Whiteboard", icon: <IconChalkboard size={18} /> },
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

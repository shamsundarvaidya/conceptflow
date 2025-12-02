// src/components/ConceptFlowLogo.tsx
import { Group, Text, ThemeIcon } from "@mantine/core";

type ConceptFlowLogoProps = {
  size?: number;
};

export function ConceptFlowLogo({ size = 32 }: ConceptFlowLogoProps) {
  return (
    <Group gap="xs">
      <ThemeIcon
        radius="xl"
        size={size}
        variant="gradient"
        gradient={{ from: "indigo", to: "teal" }}
      >
        CF
      </ThemeIcon>
      <Text fw={700} fz="lg"  c="gray.0" style={{ letterSpacing: 0.5 }}>
        ConceptFlow
      </Text>
    </Group>
  );
}

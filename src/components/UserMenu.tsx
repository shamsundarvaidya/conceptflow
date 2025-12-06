import { Menu, Avatar, Text, rem } from "@mantine/core";
import {
    TbSettings,
    TbLogout,
    TbUser,
} from "react-icons/tb";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router";

export function UserMenu() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "?";

    return (
        <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
                <Avatar color="cyan" radius="xl" style={{ cursor: "pointer" }}>
                    {firstLetter}
                </Avatar>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>
                    <Text size="xs" c="dimmed">
                        {user?.email}
                    </Text>
                </Menu.Label>
                <Menu.Item
                    leftSection={
                        <TbUser style={{ width: rem(14), height: rem(14) }} />
                    }
                >
                    Profile
                </Menu.Item>
                <Menu.Item
                    leftSection={
                        <TbSettings style={{ width: rem(14), height: rem(14) }} />
                    }
                >
                    Settings
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                    color="red"
                    leftSection={
                        <TbLogout style={{ width: rem(14), height: rem(14) }} />
                    }
                    onClick={handleLogout}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}

import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  AppShell,
  Text,
  Burger,
  Button,
  Group,
  Stack,
  NavLink,
} from '@mantine/core';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  IconDashboard,
  IconFiles,
  IconLogout,
  IconQuestionMark,
} from '@tabler/icons-react';

export function AppLayout() {
  const [opened, setOpened] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppShell
      header={{ height: { base: 50, md: 70 } }}
      navbar={{
        width: { sm: 200, lg: 300 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            hiddenFrom="sm"
            size="sm"
          />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Text size="lg" fw={700}>BiSim</Text>
            <Text size="sm">{user?.email}</Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          <Stack gap="xs">
            <NavLink
              component={Link}
              to="/dashboard"
              label="Dashboard"
              leftSection={<IconDashboard size={16} />}
            />
            
            {user?.role === 'ADMIN' && (
              <>
                <NavLink
                  component={Link}
                  to="/admin/documents"
                  label="Documents"
                  leftSection={<IconFiles size={16} />}
                />
                <NavLink
                  component={Link}
                  to="/admin/questions"
                  label="Questions"
                  leftSection={<IconQuestionMark size={16} />}
                />
              </>
            )}
          </Stack>
        </AppShell.Section>
        
        <AppShell.Section>
          <Button
            variant="subtle"
            color="red"
            fullWidth
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
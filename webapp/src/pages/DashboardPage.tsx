import { Container, Title, Text, Card, Group, Stack } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title>Dashboard</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Welcome back, {user?.name || user?.email}!
          </Text>
        </div>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Your Account</Text>
            <Text size="sm" c="dimmed">
              Role: {user?.role}
            </Text>
          </Group>

          <Text size="sm" c="dimmed">
            Email: {user?.email}
          </Text>
        </Card>

        {user?.role === 'ADMIN' && (
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Text fw={500} mb="xs">
              Admin Actions
            </Text>
            <Text size="sm" c="dimmed">
              As an admin, you can upload documents and manage questions from the navigation menu.
            </Text>
          </Card>
        )}
      </Stack>
    </Container>
  );
}
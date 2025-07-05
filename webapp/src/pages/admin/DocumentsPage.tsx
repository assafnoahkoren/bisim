import { Container, Title, Text, Card, Button, Group, Stack } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';

export function DocumentsPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <div>
            <Title>Documents</Title>
            <Text c="dimmed" size="sm" mt="xs">
              Upload and manage documents for question extraction
            </Text>
          </div>
          <Button leftSection={<IconUpload size={16} />}>
            Upload Document
          </Button>
        </Group>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Text ta="center" c="dimmed" py="xl">
            No documents uploaded yet
          </Text>
        </Card>
      </Stack>
    </Container>
  );
}
import { Container, Title, Text, Card, Stack } from '@mantine/core';

export function QuestionsPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title>Questions</Title>
          <Text c="dimmed" size="sm" mt="xs">
            View and manage extracted questions from documents
          </Text>
        </div>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Text ta="center" c="dimmed" py="xl">
            No questions extracted yet
          </Text>
        </Card>
      </Stack>
    </Container>
  );
}
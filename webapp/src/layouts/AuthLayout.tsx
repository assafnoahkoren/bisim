import { Outlet } from 'react-router-dom';
import { Box, Container, Paper } from '@mantine/core';

export function AuthLayout() {
  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container size={420} my={40}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
}
import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button, Paper } from '@mui/material';
import { ClerkProvider, SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <Container maxWidth="100vw">
      <AppBar position="static" sx={{ backgroundColor: '#1e88e5', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Flashcard SaaS
          </Typography>
          <Button color="inherit" href="../sign-up/sign-up">Sign Up</Button>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: 'center', my: 8 }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1e88e5' }}>
          Welcome Back
        </Typography>
        <Typography variant="h6" component="p" sx={{ mb: 4, color: '#64b5f6' }}>
          Sign in to begin flashcard generation
        </Typography>
        <ClerkProvider>
          <SignIn />
        </ClerkProvider>
        
      </Box>
    </Container>
  );
}
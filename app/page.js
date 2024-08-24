'use client'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Box, Typography, AppBar, Toolbar, Button, Grid, Card, CardContent, CardActions, Stack } from '@mui/material';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Head from 'next/head';
import getStripe from '../utils/get-stripe.js';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1e88e5', // Blue
    },
    secondary: {
      main: '#f50057', // Pink
    },
    third: {
      main: '#f50057', // Pink
    },
  },
  typography: {
    h2: {
      fontWeight: 600,
      color: '#1e88e5',
    },
    h4: {
      fontSize: '32px',
      fontWeight: 600,
      color: '#000000',
    },
    h5: {
      fontWeight: 500,
      color: '#424242',
    },
    body1: {
      fontSize: '1rem',
      color: '#616161',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
  },
});

export default function Home() {

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'https://flashpass.vercel.app/',
      },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error){
      console.warn(error.message)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='100vw'>
        <Head>
          <title>FlashPass</title>
          <meta name="description" content="Create flashcards from text" />
        </Head>

        <AppBar position="static" sx={{ mb: 4 }}>
          <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
            FlashPass
          </Typography>
          <ClerkProvider>
            <SignedOut>
              <Button color="inherit" href="/sign-in">Login</Button>
              <Button color="inherit" href="/sign-up">Sign Up</Button>
            </SignedOut>
            <SignedIn>
            <Button color="inherit" href="/generate">Generate</Button>
              <Button color="inherit" href="/flashcards">Collection</Button>
              <UserButton />
            </SignedIn>
          </ClerkProvider>
          </Toolbar>
        </AppBar>

        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to FlashPass
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            The easiest way to create flashcards from your text.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} href="/generate">
            Get Started
          </Button>
        </Box>

        <Box sx={{ my: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    Personalized Learning Experience
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    The AI analyzes user performance and adapts the flashcard content based on individual learning progress, ensuring efficient and effective learning.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    Automated Content Generation
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Save time by generating flashcards automatically from documents, notes, or web content. The AI extracts key concepts, creating comprehensive flashcards effortlessly.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    Interactive and Engaging Review Sessions
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Enjoy interactive features like spaced repetition algorithms, gamified quizzes, and progress tracking, ensuring better retention and an enjoyable learning experience.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ my: 5, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    Free
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Access basic features with a limited number of flashcards and basic AI assistance. Ideal for casual learners.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="primary" fullWidth>
                    Sign Up
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    Pro
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Unlock advanced features with unlimited flashcards, personalized learning paths, and priority access to our support team.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="secondary" fullWidth onClick={handleSubmit}>
                    Upgrade Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    Enterprise
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Tailored solutions for organizations, including team collaboration, advanced analytics, and custom integrations.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="secondary" fullWidth>
                    Contact Us
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
'use client'
import { ThemeProvider, createTheme } from '@mui/material'
import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { doc, collection, CollectionReference, getDoc, setDoc, writeBatch } from 'firebase/firestore'
import { db } from '@/firebase'
import {  
  AppBar,
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Paper,
  CardActionArea,
  Toolbar
} from '@mui/material'
import { useSearchParams } from 'next/navigation'

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
    h3: {
      fontWeight: 600,
      color: '#1e88e5',
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


export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
          if (!user) return
      
          const docRef = doc(collection(db, 'users'), user.id)
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            setFlashcards(collections)
          } else {
            await setDoc(docRef, {flashcards: []})
          }
        }
        getFlashcards()
      }, [user])

      if (!isLoaded || !isSignedIn) {
        return <></>
      }

      const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
      }

    return (
      <ThemeProvider theme={theme}>
      <Container maxWidth="100vw">
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
            FlashPass
            </Typography>
                <Button color="inherit" href="/">Home</Button>
                <Button color="inherit" href="/flashcards">Collection</Button>
                <UserButton />
            </Toolbar>
          </AppBar>
      <Typography variant='h3'>Saved Flashcards Lists</Typography>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                <CardContent>
                  <Typography variant='h6'> {flashcard.name}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    </ThemeProvider>
  )
}
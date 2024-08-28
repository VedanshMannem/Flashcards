'use client'
import { useUser } from '@clerk/nextjs'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { doc, collection, getDoc, setDoc, writeBatch } from 'firebase/firestore'
import { db } from '@/firebase'
import {  
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
  AppBar,
  Toolbar
} from '@mui/material'
import { ClerkProvider } from '@clerk/nextjs'

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

export default function Generate() {
  
  const {isLoaded, isSignedIn, user} = <ClerkProvider>useUser()</ClerkProvider>
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [text, setText] = useState('')
  const [name, setName ] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()
  
  
  const handleSubmit = async () => {
    fetch('api/generate', {
      method: 'POST',
      body: text,
    })
      .then((res) => res.json())
      .then((data) => setFlashcards(data))
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev, 
      [id]: !prev[id],
    }))
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name for your flashcard set.')
      return
    }

  const batch = writeBatch(db)
  const userDocRef = doc(collection(db, 'users'), user.id)
  const docSnap = await getDoc (userDocRef)

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || []
      if (collections.find((f) => f.name === name)){
        alert('flashcard collection with the same name already exists.')
        return
      } else {
        collections.push({name})
        batch.set(userDocRef, {flashcards: collections}, {merge: true})
      }
    } else {
      batch.set(userDocRef, {flashcards: [{name}]})
    }

    const colRef = collection(userDocRef, name)
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef)
      batch.set(cardDocRef, flashcard)
    })

    await batch.commit()
    handleClose()
    router.push('/flashcards')
  }

  return( 
    <ClerkProvider>
    <ThemeProvider theme={theme}>
    <Container maxWidth="100vw">
      <AppBar position="static" sx={{ mb: 4 }}>
          <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
          FlashPass
          </Typography>
            <SignedOut>
              <Button color="inherit" href="../sign-in/sign-in">Login</Button>
              <Button color="inherit" href="../sign-up/sign-up">Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <Button color="inherit" href="/">Home</Button>
              <Button color="inherit" href="/flashcards">Collection</Button>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md">
      <Box 
        sx={{
          mt: 4, 
          mb: 6,
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center'
        }}
      > 
        <Typography variant='h3'>Generate Flashcards</Typography>
        <Paper sx={{ p: 4, width: '100%' }}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant='outlined'
            sx={{
              mb: 2,
            }}/>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSubmit}
            fullWidth
          >
            Submit
          </Button>
        </Paper>
      </Box>
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant='h5'>Flashcards Preview</Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea
                    onClick={() => {
                      handleCardClick(index)
                    }}>
                    <CardContent>
                      <Box
                        sx={{
                          perspective: '1000px',
                          '& > div': {
                            transition: 'transform 0.6s',
                            transformStyle: 'preserve-3d',
                            position: 'relative',
                            width: '100%',
                            height: '200px',
                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                            transform: flipped[index]
                              ? 'rotateY(180deg)'
                              : 'rotateY(0deg)',
                          },
                        }}
                      >
                        <div>
                          {/* Front Side */}
                          <Box
                            sx={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 2,
                              boxSizing: 'border-box',
                              backgroundColor: '#fff', // Optional, to distinguish sides
                            }}
                          >
                            <Typography variant='h5' component='div'>
                              {flashcard.front}
                            </Typography>
                          </Box>
                          {/* Back Side */}
                          <Box
                            sx={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 2,
                              boxSizing: 'border-box',
                              transform: 'rotateY(180deg)',
                              backgroundColor: '#f0f0f0', // Optional, to distinguish sides
                            }}
                          >
                            <Typography variant='h5' component='div'>
                              {flashcard.back}
                            </Typography>
                          </Box>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' color='secondary' onClick={handleOpen}>
              Save
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard collection
          </DialogContentText>
          <TextField 
            autoFocus 
            margin='dense' 
            label='Collection Name' 
            type='text' 
            fullWidth 
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant='outlined'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
    </Container>
    </ThemeProvider>
    </ClerkProvider>
  )
}
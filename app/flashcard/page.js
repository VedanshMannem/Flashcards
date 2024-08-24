'use client'
import { ThemeProvider, createTheme } from '@mui/material'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
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
  import { UserButton } from '@clerk/nextjs'
import { useSearchParams } from "next/navigation"

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

export default function Flashcard() {
const {isLoaded, isSignedIn, user} = useUser()
const [flashcards, setFlashcards] = useState([])
const [flipped, setFlipped] = useState([])

const searchParams = useSearchParams()
const search = searchParams.get('id')

useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return
      const colRef = collection(doc(collection(db, 'users'), user.id), search)
      const docs = await getDocs(colRef)
      const flashcards = []
      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() })
      })
      setFlashcards(flashcards)
    }
    getFlashcard()
  }, [user, search])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (isLoaded || !isSignedIn) {
    return <>
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
    <Typography variant="h3">Flashcards Preview</Typography>
    <Grid container spacing={3} sx={{ mt: 4 }}>
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
  </Container></ThemeProvider></>
  }}
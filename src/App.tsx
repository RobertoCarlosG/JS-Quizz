import './App.css'
import { Container, Typography, Stack } from '@mui/material'
import { JavaScriptLogo } from './JavaScriptLogo'
import { Start } from './Start'
import { useQuestionsStore } from './store/questions'
import { Game } from './components/Game'

function App() {
  const questions = useQuestionsStore(state => state.questions)
  
  return (
    <main>
      <Container maxWidth='sm'>
          <Stack direction='row' gap={2} alignItems='center' justifyContent='center'>
            <JavaScriptLogo />
            <Typography variant='h2' component="h1">
              
              Let's play a Game
            </Typography>
          </Stack>
          {questions.length === 0 && <Start />}
          {questions.length > 0 && <Game />}
      </Container>
    </main>
  )
}

export default App

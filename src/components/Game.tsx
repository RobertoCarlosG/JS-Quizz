import { IconButton,Typography, List, ListItem, ListItemButton, ListItemText, Stack, Card } from "@mui/material";
import { useQuestionsStore } from "../store/questions";
import { Footer } from "./Footer";
import { Question, type Question as QuestionType } from "../types";
import SyntaxHighlighter from 'react-syntax-highlighter'
import { qtcreatorDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

//Showing if its correct answer

const getBackgroundColor = ( info:Question, index: number ) =>{
  const { userSelectedAnswer, correctAnswer } = info

  if (userSelectedAnswer == null) return 'transparent'
  if (index !== correctAnswer && index !== userSelectedAnswer) return 'transparent'
  if (index === correctAnswer) return 'green'
  if (index === userSelectedAnswer) return 'red'
  return 'transparent '
}

const Question = ({ info }: {info: QuestionType}) =>{

  const selectAnswer = useQuestionsStore(state => state.selectAnswer)

  const createHandleClick = (answerIndex: number) => () =>{
    selectAnswer(info.id, answerIndex)
  }

  
  return (
    <Card variant='outlined' sx={{ bgcolor:'#222', p:2, textAlign:'left', mt:4}}>
      
      <Typography variant='h5'>
        {info.question}
      </Typography>

      <SyntaxHighlighter language="javascript" style={qtcreatorDark}>
        {info.code}
      </SyntaxHighlighter>

      <List sx={{bgcolor:'#333'}} disablePadding>
        {info.answers.map((answer, index)=>(
          <ListItem 
            key={index} 
            divider 
            disablePadding
          >
            <ListItemButton 
              disabled={info.userSelectedAnswer != null}
              onClick={createHandleClick(index)}
              sx={{ bgcolor: getBackgroundColor(info, index)}}
              >
              <ListItemText 
                primary={answer} 
                sx={{ 
                  fontWeight:500, 
                  textAlign:'center'
                  }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

    </Card>
  )
}

export const Game = () =>{
  const questions = useQuestionsStore(state => state.questions)
  const currentQuestion = useQuestionsStore(state => state.currentQuestion)
  const goNextQuestion = useQuestionsStore(store => store.goNextQuestion)
  const goPreviousQuestion = useQuestionsStore(store => store.goPreviousQuestion)

  

  const questionInfo = questions[currentQuestion]
  return (
    <div>
      <IconButton onClick={goPreviousQuestion} disabled={currentQuestion === 0}>
          <ArrowBackIosNew />
        </IconButton>

        {currentQuestion + 1} / {questions.length}

        <IconButton onClick={goNextQuestion} disabled={currentQuestion >= questions.length-1}>
          <ArrowForwardIos />
        </IconButton>
      <Stack direction='row' gap={2} alignItems='center' justifyContent='center'>
        <Question info={questionInfo}/>
      </Stack>
        <Footer />
    </div>
  )
}
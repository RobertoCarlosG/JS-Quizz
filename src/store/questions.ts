import { create } from 'zustand'
import { type Question } from '../types'
import confetti from 'canvas-confetti'
import { persist,devtools } from 'zustand/middleware'

interface State{
  questions: Question[]
  currentQuestion: number
  fetchQuestions: (limit: number) => Promise<void>
  selectAnswer: (questionId: number, answerIndex: number) => void
  goNextQuestion: () => void
  goPreviousQuestion: () => void
  reset: () => void
}

const apiKey = '$2a$10$YgV6QkRilQSG44a4jQUE3.3Y.ZVnJRjqEQ9.Pds0438i6nk53g3MS'

export const useQuestionsStore = create<State>()(devtools(persist((set,get)=>{
  return {
    questions: [],
    currentQuestion: 0,

    fetchQuestions: async (limit: number) =>{
      const response = await fetch('https://api.jsonbin.io/v3/b/6517770012a5d37659851fe1', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Key': apiKey
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch comments.')
  }

  const json = await response.json()
console.log(json)
      
      const questions = json.record.sort(() => Math.random() - 0.5).slice(0, limit)
      set({ questions })
      /* Se puede poner state => ...state, questions

      // set(state => ({
      //   questions: [
      //     {
      //       "id": 8,
      //       "question": "¿Cuál es el resultado de la siguiente expresión?",
      //       "code": "'2' + 3 * 4",
      //       "answers": [
      //         "212",
      //         "20",
      //         "26",
      //         "Error"
      //       ],
      //       "correctAnswer": 0
      //     }
      //   ]
      // }))*/
    },
    selectAnswer:(questionId: number, answerIndex: number)=>{
      const { questions } = get()
      const newQuestions = structuredClone(questions)
      const questionIndex = newQuestions.findIndex(q => q.id === questionId)
      const questionInfo = newQuestions[questionIndex]
      const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex

      if (isCorrectUserAnswer) confetti()
      newQuestions[questionIndex] = {
        ...questionInfo,
        isCorrectUserAnswer,
        userSelectedAnswer: answerIndex
      }
      set({ questions: newQuestions })
    },
    goNextQuestion: ()=>{
      const {currentQuestion, questions} = get()
      const nextQuestion = currentQuestion + 1

      if (nextQuestion < questions.length){
        set({ currentQuestion: nextQuestion })
      }
    },
    goPreviousQuestion: () =>{
      const { currentQuestion } = get()
      const previousQuestion = currentQuestion -1
      
      if(previousQuestion >= 0){
        set({ currentQuestion: previousQuestion })
      }
    },
    reset: ()=>{
      set({ currentQuestion:0, questions:[] })
    }
  }
},{
  name: 'questions'
})))

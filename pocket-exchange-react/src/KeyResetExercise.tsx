import { useState } from 'react'

// R6 exercise: the `key` trick. Not used by the app.
// To try it, temporarily render <KeyResetExercise /> in main.tsx.
//
// 1. Type something in the box, then click "Switch person": the text stays,
//    because React sees the same component at the same position and preserves its state.
// 2. Add key={person} to <Note /> below: now the text resets on every switch,
//    because a different key means a different component, so React throws the old state away.

function Note({ person }: { person: string }) {
  const [text, setText] = useState('')
  return (
    <label>
      Note for {person}:{' '}
      <input value={text} onChange={(e) => setText(e.target.value)} />
    </label>
  )
}

export function KeyResetExercise() {
  const [person, setPerson] = useState('Alice')

  return (
    <div>
      <Note person={person} />
      <button
        type="button"
        onClick={() => setPerson(person === 'Alice' ? 'Bob' : 'Alice')}
      >
        Switch person
      </button>
    </div>
  )
}

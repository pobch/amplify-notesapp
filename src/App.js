import React, { useReducer, useEffect } from 'react'
import { API } from 'aws-amplify'
import { listNotes } from './graphql/queries'
import { List } from 'antd'
import 'antd/dist/antd.css'

const initialState = { notes: [], loading: true, error: false, form: { name: '', description: '' } }

function reducer(state, action) {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.notes, loading: false }
    case 'ERROR':
      return { ...state, error: true, loading: false }
    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  async function fetchNotes() {
    try {
      const notesData = await API.graphql({ query: listNotes })
      dispatch({ type: 'SET_NOTES', notes: notesData.data.listNotes.items })
    } catch (err) {
      console.log('error:', err)
      dispatch({ type: 'ERROR' })
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <div style={styles.container}>
      <List loading={state.loading} dataSource={state.notes} renderItem={renderItem} />
    </div>
  )

  function renderItem(item) {
    return (
      <List.Item style={styles.item}>
        <List.Item.Meta title={item.name} description={item.description} />
      </List.Item>
    )
  }
}

const styles = {
  container: { padding: 20 },
  input: { marginBottom: 10 },
  item: { textAlign: 'left' },
  p: { color: '#1890ff' },
}

export default App

import React from 'react';
import logo from './logo.svg';
import './App.css';
import HooksRedux from './hooks-redux/hooks-redux'

const { Provider, store } = HooksRedux({
    isDev: true,
    initialState: {jg:'zzz',age:18},  
})

function actionAdd() {

  return {
    //通过这个值去设置最终接受的reducer
    type: 'addCount',
    reducer(state) {
      //带上原来的state
      return {
        ...state, age: state.age + 1

      }
    }
  }
}


function Button() {

  function handlerAdd() {
      store.dispatch(actionAdd())
  }

  return <button onClick={handlerAdd}>点击</button>
}

function Page() {
  const state = store.useContext()
  return (
    <>
      <span className="App-link">{state.age}</span><Button />
    </>
  )
}


export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Provider>
          <Page />
        </Provider>
      </header>
    </div>
  );
}


import React from 'react'
const { useReducer,createContext ,useContext} = React;

function middleWareLog(store, lastState, nextState,action) {
    console.log('--------------', action.type)
    console.log('--------------', nextState)
    console.log('--------------', lastState)
}


//把reducer集成到action中
const reducerInAction = (state, action) => {
    //Action和Reducer 不分家， action对状态管理直接在reducer生效
    if (typeof action.reducer === 'function') {
        return action.reducer(state);
    }
    return state
}

export default function createStore(params) {


    const { isDev, reducer, initialState, middleware } = {
        isDev: false,
        initialState: {},
        reducer: reducerInAction,
        middleware: [middleWareLog],
        ...params
    }

    const myContext = createContext()

    //store只有dispatch和 _state
    const store = {

        _state: initialState,
        getState: function () {
            return store._state;
        },
        dispatch: undefined,
        useContext:function(){
            return useContext(myContext)
        }
    }

    let isCheckedmiddleWare = false


    const middleWareReducer = (lastState, action) => {

        let nextState = reducer(lastState, action)

        if (isCheckedmiddleWare) {
            if (!Array.isArray()) {
                throw new Error("请设置middleware为数组")
            }
            isCheckedmiddleWare = true
        }


        //中间件的修改
        for (let item of middleware) {
            const newState = item(store, lastState, nextState,action,isDev)
            if(newState){
                nextState = newState;
            }
        }
        //更新state
        store._state = nextState;
        return nextState;

    }

    const Provider = props => {
        //只有dispatch可以改变state
        const [state, dispatch] = useReducer(middleWareReducer, initialState)

        if(!store.dispatch){
            store.dispatch = async function(action){
                if(typeof action === 'function'){
                    await action(dispatch,store._state)
                    return store._state
                }
                dispatch(action)
            }
        }
        return <myContext.Provider {...props} value={state} />
    }





    return {
        Provider,
        store
    }
}


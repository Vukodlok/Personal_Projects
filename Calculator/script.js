//redux setup
const initialState = {
  display: "0",
  operand1: null,
  operand2: null,
  operation: null,
  isReset: true
};

const ADD_DIGIT = "ADD_DIGIT";
const SET_OPERATION = "SET_OPERATION";
const CLEAR = "CLEAR";
const CALCULATE = "CALCULATE";
const ADD_DECIMAL = "ADD_DECIMAL";

const addDigit = (digit) => ({
  type: ADD_DIGIT,
  payload: digit
});

const setOperation = (operation) => ({
  type: SET_OPERATION,
  payload: operation
});

const clearAll = () => ({
  type: CLEAR
});

const calculate = () => ({
  type: CALCULATE
});

const addDecimal = () => ({
  type: ADD_DECIMAL
});

//reducer to handle state with actions
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_DIGIT:
      if (state.operation === null) {
        if (state.operand1 === "0" && action.payload === "0") {
          return state;
        }
        return {
          ...state,
          operand1: state.isReset ? action.payload : (state.operand1 === "0" ? action.payload : (state.operand1 || "") + action.payload),
          display: state.isReset ? action.payload : (state.display === "0" ? action.payload : state.display + action.payload),
      isReset: false
        };
      } else {
        if (state.operand2 === "0" && action.payload === "0") {
          return state;
        }
        return {
          ...state,
          operand2: state.operand2 === null ? action.payload : (state.operand2 === "0" ? action.payload : state.operand2 + action.payload),
          display: state.display + action.payload
        };
      }

    case SET_OPERATION:
      const lastChar = state.display.trim().slice(-1);
      const isOperator = /[\+\-\*\/]/.test(lastChar);
      
      if (state.operation === null && state.operand1 !== null) {
        return {
          ...state,
          operation: action.payload,
          display: `${state.display} ${action.payload} `,
        };
      } 
      if (state.operand2 === null) { 
        if (isOperator && action.payload === "-") {
          return {
            ...state,
            operand2: "-",
            display: `${state.display} -`
          };
        }
        if (isOperator) {
          return {
            ...state,
            operation: action.payload,
            display: `${state.display.slice(0, -3)} ${action.payload} `
          };
        }
      }
      if (state.operand2 !== null) {
        const expression = `${state.operand1} ${state.operation} ${state.operand2}`;
        const result = eval(expression.replace(/x/g, "*"));
        
        return {
          ...state,
          operand1: result.toString(),
          operand2: null,
          operation: action.payload,
          display: `${result} ${action.payload} `,
        };
      }
      return state;

    case CLEAR:
      return {
        ...initialState,
        isReset: true
      };
      
    case CALCULATE:
      if (!state.operand1 || !state.operation || !state.operand2) {
        return state; // Ignore invalid input
      }

  try {
    let expression = `${state.operand1 || ""} ${state.operation || ""} ${state.operand2 || ""}`;
    expression = expression.replace(/x/g, "*");
    
    const result = eval(expression);

    return {
      ...state,
      display: result.toString(),
      operand1: result.toString(),
      operand2: null,
      operation: null,
      isReset: false
    };
  } catch (error) {
    return {
      ...state,
      display: "Error",
      isReset: true
    };
  }

    case ADD_DECIMAL:
      if (state.operation === null) {
        if (state.operand1 && state.operand1.includes(".")) return state;
        return {
          ...state,
          operand1: state.operand1 === null ? "0." : state.operand1 + ".",
          display: state.operand1 === null ? "0." : state.display + "."
        };
      } else {
        if (state.operand2 && state.operand2.includes(".")) return state;
        return {
          ...state,
          operand2: state.operand2 === null ? "0." : state.operand2 + ".",
          display: state.display + "."
        };
      }

    default:
      return state;
  }
};

//redux store
const store = Redux.createStore(reducer);

//react component
const Calculator = () => {
  const dispatch = ReactRedux.useDispatch();
  const display = ReactRedux.useSelector((state) => state.display);
  console.log("Display state:", display);
  
  const handleDigitClick = (digit) => {
    dispatch(addDigit(digit));
  };
  
  const handleOperationClick = (operation) => {
    dispatch(setOperation(operation));
  };
  
  return (
    <div id="container">
      <div id="display">{display}</div>
      <button id="seven" onClick={() => handleDigitClick("7")}>7</button>
      <button id="eight" onClick={() => handleDigitClick("8")}>8</button>
      <button id="nine" onClick={() => handleDigitClick("9")}>9</button>
      <button id="add" onClick={() => handleOperationClick("+")}>+</button>
      <button id="four" onClick={() => handleDigitClick("4")}>4</button>
      <button id="five" onClick={() => handleDigitClick("5")}>5</button>
      <button id="six" onClick={() => handleDigitClick("6")}>6</button>
      <button id="subtract" onClick={() => handleOperationClick("-")}>-</button>
      <button id="one" onClick={() => handleDigitClick("1")}>1</button>
      <button id="two" onClick={() => handleDigitClick("2")}>2</button>
      <button id="three" onClick={() => handleDigitClick("3")}>3</button>
      <button id="multiply" onClick={() => handleOperationClick("*")}>*</button>
      <button id="zero" onClick={() => handleDigitClick("0")}>0</button>
      <button id="decimal" onClick={() => dispatch(addDecimal())}>.</button>
      <button id="divide" onClick={() => handleOperationClick("/")}>/</button>
      <button id="equals" onClick={() => dispatch(calculate())}>=</button>
      <button id="clear" onClick={() => dispatch(clearAll())}>AC</button>
    </div>
  );
};

//render the app
ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <Calculator />
  </ReactRedux.Provider>,
  document.getElementById("root")
);

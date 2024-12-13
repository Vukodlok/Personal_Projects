//redux setup
const initialState = {
  breakLength: 5,
  sessionLength: 25,
  timeLeft: 25 * 60,
  currentMode: "Session",
  isRunning: false
};

//reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "DECREMENT_TIMER":
      return { ...state, timeLeft: state.timeLeft - 1 };
    case "SWITCH_MODE":
      const isSession = state.currentMode === "Session";
      return {
        ...state,
        currentMode: isSession ? "Break" : "Session",
        timeLeft: (isSession ? state.breakLength : state.sessionLength) * 60,
      };
    case "RESET":
      return { ...initialState };
    case "START_TIMER":
      return { ...state, isRunning: true };
    case "PAUSE_TIMER":
      return { ...state, isRunning: false };
    case "INCREMENT_SESSION":
      return state.isRunning
        ? state
        : {
            ...state,
            sessionLength: Math.min(state.sessionLength + 1, 60),
            timeLeft: (state.sessionLength + 1) * 60,
          };
    case "DECREMENT_SESSION":
      return state.isRunning
        ? state
        : {
            ...state,
            sessionLength: Math.max(state.sessionLength - 1, 1),
            timeLeft: (state.sessionLength - 1) * 60,
          };
    case "INCREMENT_BREAK":
      return {
        ...state,
        breakLength: Math.min(state.breakLength + 1, 60),
      };
    case "DECREMENT_BREAK":
      return {
        ...state,
        breakLength: Math.max(state.breakLength - 1, 1),
      };
    default:
      return state;
  }
};

//redux store
const store = Redux.createStore(reducer);

//react component
const Timer = () => {
  const dispatch = ReactRedux.useDispatch();
  const { breakLength, sessionLength, timeLeft, currentMode, isRunning } = ReactRedux.useSelector(
    (state) => state
  );
  
const handleStartStop = () => {
  if (isRunning) {
    dispatch({ type: "PAUSE_TIMER" });
  } else {
    dispatch({ type: "START_TIMER" });
  }
};
  
const handleReset = () => {
  dispatch({ type: "RESET" });
  
  const audio = document.getElementById("beep");
  audio.pause();
  audio.currentTime = 0;
};
  
//format time in MM:SS
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
  
//countdown logic
React.useEffect(() => {
  if (isRunning && timeLeft > 0) {
    const timer = setInterval(() => {
      dispatch({ type: "DECREMENT_TIMER" });
    }, 1000);
    return () => clearInterval(timer);
  }
  
  //switch between session and break when time runs out
  if (timeLeft === 0) {
    const audio = document.getElementById("beep");
    audio.play();
    dispatch({ type: "SWITCH_MODE" });
  }
}, [isRunning, timeLeft, dispatch]);
  
  return (
    <div id="container">
      <h1 id="heading">Timer</h1>
      <h2 id="session-label">Session Length</h2>
      <h2 id="break-label">Break Length</h2>
      <i id="session-decrement" className="fas fa-arrow-down" onClick={() => dispatch({ type: "DECREMENT_SESSION" })}></i>
      <h3 id="session-length">{sessionLength}</h3>
      <i id="session-increment" className="fas fa-arrow-up" onClick={() => dispatch({ type: "INCREMENT_SESSION" })}></i>
      <i id="break-decrement" className="fas fa-arrow-down" onClick={() => dispatch({ type: "DECREMENT_BREAK" })}></i>
      <h3 id="break-length">{breakLength}</h3>
      <i id="break-increment" className="fas fa-arrow-up" onClick={() => dispatch({ type: "INCREMENT_BREAK" })}></i>
      <h2 id="timer-label">{currentMode}</h2>
      <h1 id="time-left">{formatTime(timeLeft)}</h1>
      <i id="start_stop" className={`fas ${isRunning ? "fa-pause" : "fa-play"}`}
        onClick={handleStartStop}></i>
      <i id="reset" className="fas fa-redo-alt" onClick={handleReset}></i>
      <audio
        id="beep"
        src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
        preload="auto">
      </audio>
    </div>
  );
};

//render the app
ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <Timer />
  </ReactRedux.Provider>,
  document.getElementById("root")
);

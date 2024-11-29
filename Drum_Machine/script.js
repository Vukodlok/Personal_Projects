// Redux setup
const playSound = (key, soundName) => ({
  type: 'PLAY_SOUND',
  payload: { key, soundName }
});

const initialState = {
  activeKey: '',
  soundName: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PLAY_SOUND':
      return {
        ...state,
        activeKey: action.payload.key,
        soundName: action.payload.soundName
      };
    default:
      return state;
  }
};

// Redux store
const store = Redux.createStore(reducer);

// React Component
const DrumMachine = () => {
  const dispatch = ReactRedux.useDispatch();
  const { activeKey, soundName } = ReactRedux.useSelector(state => state);

  // Sound data
  const soundFiles = {
    Q: { src: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-1.mp3', name: 'Heater 1' },
    W: { src: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-2.mp3', name: 'Heater 2' },
    E: { src: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-3.mp3', name: 'Heater 3' },
    A: { src: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-4_1.mp3', name: 'Heater 4' },
    S: { src: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-6.mp3', name: 'Clap' },
    D: { src: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Dsc_Oh.mp3', name: 'Open-HH' },
    Z: { src: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Kick_n_Hat.mp3', name: 'Kick-n-Hat' },
    X: { src: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/RP4_KICK_1.mp3', name: 'Kick' },
    C: { src: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Cev_H2.mp3', name: 'Closed-HH' }
  };

  // Play sound
  const playAudio = (key) => {
    const audio = document.getElementById(key);
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  // Handle key press
  const handleKeyPress = (event) => {
    const key = event.key.toUpperCase();
    if (soundFiles[key]) {
      const { name } = soundFiles[key];
      dispatch(playSound(key, name));
      playAudio(key);
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div id="drum-machine">
      <h1>Drum Machine</h1>
      <p id="display">{soundName || "Click or press a key to play"}</p>
      <div className="drum-pads">
        {Object.keys(soundFiles).map((key) => (
          <div
            key={key}
            id={`drum-pad-${key}`}
            className="drum-pad"
            onClick={() => {
              const { name } = soundFiles[key];
              dispatch(playSound(key, name));
              playAudio(key);
            }}
          >
            {key}
            <audio id={key} className="clip" src={soundFiles[key].src}></audio>
          </div>
        ))}
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <DrumMachine />
  </ReactRedux.Provider>,
  document.getElementById("root")
);

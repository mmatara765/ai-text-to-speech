import{useState, useEffect} from "react";



function App() {

  const[text, setText] = useState("");
  const[loading, setLoading] = useState(false);
  const[aiReady, setAiReady] = useState(false);
  const[error, setError] = useState("");
  const[currentAudio, setCurrentAudio] = useState(null);


  useEffect (() =>{
    const checkReady = setInterval(() => {
      if(
        window.puter &&
        window.puter.ai &&
        typeof window.puter.ai.txt2speech === "function"
      ){
        setAiReady(true);
        clearInterval(checkReady);
      }}, 300)
    return () => clearInterval(checkReady);
  }, [])

  const speakText = async () => {
    if(text.length > 300){
      setError("Text must be less than 3000 charachters!")
      return;
    }

  setLoading(true);
  setError("");

  if(currentAudio){
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  try{
    const audio = await window.puter.ai.txt2speech(text, {
      engine: "standard",
      language: "en-US",

    });
    setCurrentAudio(audio)
    audio.play();
    audio.addEventListener("ended", () => setLoading(false));
    audio.addEventListener("error", () => setLoading(false));
  }catch(err){
    setError(err.message || "Something wnet wrong with text-to-speech.")
    setLoading(false);
  }

  }

  const stopAudio = () => {
    if(currentAudio){
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setLoading(false);
    }
  }
  return (
    <>
      <div className="
      min-h-screen 
      bg-gradient-to-br from-rose-950 via-slate-950 to-purple-900
      flex flex-col
      items-center
      justify-center
      p-3
      gap-6">
        <h1 className="
        text-6xl
        sm:text-7xl
        md:text-8xl
        font-heavy
        bg-gradient-to-r from-blue-500 via-rose-500 to-indigo-500
        bg-clip-text
        text-transparent
        text-center
        ">
          AI Text To Speech
        </h1>
        <div className={`px-4 py-2 rounded-full text-sm font-medium
          ${
            aiReady ? "bg-green-500/20 text-green-300 border border-green-500/30" :
                      "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
            }`}>
              {aiReady ? "✅ AI Ready" : "⏳ Waiting for AI..."}
        </div>
        <div className="
        w-full
        max-w-2xl
        bg-gradient-to-r from-gray-800/90 to-gray-700/90 
        backdrop-blur-md
        border border-gray-600 
        rounded-3xl
        p-6
        shadow-2xl
        ">
          <textarea className="
          w-full 
          h-40 
          p-4 
          bg-gray-700/80 border border-gray-600
          rounded-2xl
          text-white
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-fuchsia-400
          transition duration-300
          disabled:opacity-50
          resize-none
          shadow-xl
          focus:shadow-fuchsia-700/70
          " placeholder="Enter text to convert to speech... (max 3000  characters)."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!aiReady}
          maxLength={3000}
          ></textarea>

          <div className="
          flex items-center
          justify-between mt-4">
            <span className="
            text-sm
            text-gray-400">
              {text.length}/3000 characters
            </span>
          </div>

          <div className="flex gap-3 mt-4">
            <button className="
            flex-1 px-6 py-3
            bg-gradient-to-r from-rose-500 to-purple-500
            hover:opacity-80
            text-white
            font-semibold
            rounded-2xl
            transition disabled:opacity-50 disabled:cursor-not-allow"
            onClick={speakText}
            disabled={!aiReady || loading || !text.trim()}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                  Speaking...
                </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 cursor-pointer">
                  📢 Speak
                  </div>
                )}
            </button>
            
            {
              currentAudio && (
                <button 
                className="
                px-6 py-3 
                bg-gradient-to-r from-gray-600 to gray-700 
                hover:opacity-80 
                text-white 
                font-semibold 
                rounded-2xl 
                border border-neutral-500/30 transistion cursor-pointer"
                onClick={stopAudio}
                >
                  ⏸️ Stop
                </button>
              )}
          </div>

          <div className="mt-6 space-y-4 text-white ">
            {error &&
            (
              <div className="p-4 bg-red-100 text-read-700 border border-red-300 rounded-2xl">
                {error}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}

export default App

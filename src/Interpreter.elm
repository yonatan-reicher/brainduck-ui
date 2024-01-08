port module Interpreter exposing
    ( reset, step, back, setCode, setCodeFinished, stateUpdated
    , setMemoryViewSize, inputRequested, output, undoOutput, clearOutput
    , stepOver
    )


port reset : () -> Cmd msg


port step : () -> Cmd msg


port setCode : String -> Cmd msg


port setCodeFinished : (Bool -> msg) -> Sub msg


type alias State =
    { pc : Int
    , memoryView : List Int
    }


port stateUpdated : (State -> msg) -> Sub msg


port setMemoryViewSize : Int -> Cmd msg


port inputRequested : (() -> msg) -> Sub msg


port output : (Int -> msg) -> Sub msg


port undoOutput : (() -> msg) -> Sub msg


port clearOutput : (() -> msg) -> Sub msg


port back : () -> Cmd msg


port stepOver : () -> Cmd msg

module Main exposing (main)

import Browser
import Css exposing (..)
import Html.Styled exposing (Html, div, p, text, textarea, button)
import Html.Styled.Attributes as Attributes exposing (css, value, disabled)
import Html.Styled.Events exposing (onInput, onClick)
import Json.Encode as E
import Interpreter


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model = 
    { code : String
    , mode : Mode
    , pc : Int
    , memoryView : List Int
    , outputStack : List Int
    }


type Mode
    = Running
    | Editing


type Msg
    = CodeChanged String
    | Step
    | Back
    | Reset
    | Edit
    | Run
    | SetModeToRun
    | StateChanged { pc : Int, memoryView : List Int }
    | InputRequested
    | Output Int
    | UndoOutput
    | ClearOutput


init : () -> ( Model, Cmd Msg )
init _ =
    ( { code = ""
      , mode = Editing
      , pc = 0
      , memoryView = [] 
      , outputStack = []
      }
    , Interpreter.setMemoryViewSize 5
    )


view : Model -> Browser.Document Msg
view model =
    { title = "Brainduck Interpreter"
    , body = [ viewContent model |> Html.Styled.toUnstyled ]
    }


gap : Int -> Style
gap unit =
    property "gap" (String.fromInt unit ++ "px")


viewContent : Model -> Html Msg
viewContent model =
    div
        [ css
            [ displayFlex
            , flexDirection row
            , alignItems stretch
            , width (pct 100)
            , height (pct 100)
            , padding (px 10)
            , boxSizing borderBox
            , gap 10
            ]
        ]
        [ viewMainPanel model
        , viewSidePanel model
        ]


myBorder : Style
myBorder =
    batch
        [ border3 (px 1) solid (rgb 0 0 0)
        , borderRadius (px 5)
        ]


viewMainPanel : Model -> Html Msg
viewMainPanel model =
    div
        [ css
            [ flex (num 1)
            , displayFlex
            , flexDirection column
            , myBorder
            , padding (px 10)
            , gap 10
            ]
        ]
        [ viewMemory model
        , viewCode model
        , viewCommands model
        ]


outputStackToString : List Int -> String
outputStackToString stack =
    stack
    |> List.reverse
    |> List.map Char.fromCode
    |> String.fromList


viewSidePanel : Model -> Html Msg
viewSidePanel model =
    div
        [ css
            [ flex (num 0.5)
            , backgroundColor (rgb 255 255 255)
            , myBorder
            ]
        ]
        [ text "Output"
        , p [] [ text (outputStackToString model.outputStack) ]
        ]


viewMemory : Model -> Html Msg
viewMemory model =
    let memory = model.memoryView |> List.indexedMap (\index value -> (index, value)) in
    div
        [ css
            [ flex (num 0.5)
            ]
        ]
        [ text "Memory"
        , div
            [ css
                [ displayFlex
                , flexDirection row
                , justifyContent center
                ]
            ]
            (memory |> List.map viewMemoryCell)
        ]


viewMemoryCell : (Int, Int) -> Html Msg
viewMemoryCell (index, value) =
    div
        [ css
            [ width (px 50)
            , height (px 50)
            , displayFlex
            , alignItems center
            , justifyContent center
            , border3 (px 1) solid (rgb 0 0 0)
            , pseudoClass "not(:first-child)" [ borderLeft (px 0) ]
            ]
        ]
        [ text (String.fromInt value) ]


viewCode : Model -> Html Msg
viewCode model =
    div
        [ css
            [ flex (num 1)
            , displayFlex
            , flexDirection column
            , alignItems stretch
            , justifyContent stretch
            ]
        ]
        [ div
            [ css
                [ flexGrow (num 0)
                ]
            ]
            [ text "Code"
            ]
        , div
            [ css
                [ flexGrow (num 1)
                , displayFlex
                , flexDirection column
                , alignItems stretch
                , justifyContent stretch
                , position relative
                , myBorder
                ]
            ]
            [ textarea
                [ css
                    [ resize none
                    , flexGrow (num 1)
                    , fontFamilies [ "JetBrains Mono", "monospace" ]
                    , padding (px 0)
                    , border (px 0)
                    , property "font-variant-ligatures" "none"
                    , fontSize (em 1)
                    , lineHeight (em 1.5)
                    , letterSpacing (px 0)
                    ]
                , onInput CodeChanged
                , value model.code
                , Attributes.disabled (model.mode == Running)
                ]
                []
            , div
                [ css
                    [ position absolute
                    , backgroundColor (rgba 100 100 255 0.5)
                    , width (ch 1.1)
                    , height (em 1.5)
                    , left (ch <| toFloat model.pc * 1.07777777777)
                    ]
                ]
                []
            ]
        ]


viewCommands : Model -> Html Msg
viewCommands model =
    div
        [ css
            [ flex (num 0.5)
            , displayFlex
            , flexDirection column
            ]
        ]
        [ text "Commands"
        , div [] (viewCommandsButtons model)
        ]


viewCommandsButtons : Model -> List (Html Msg)
viewCommandsButtons model =
    case model.mode of
        Editing ->
            [ button
                [ onClick Run
                ]
                [ text "Run" ]
            ]

        Running ->
            [ button
                [ onClick Step
                ]
                [ text "Step" ]
            , button
                [ onClick Back
                ]
                [ text "Back" ]
            , button
                [ onClick Reset
                ]
                [ text "Reset" ]
            , button
                [ onClick Edit
                ]
                [ text "Edit" ]
            ]



update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        CodeChanged code ->
            ( { model | code = code }, Cmd.none )

        Step ->
            ( model, Interpreter.step() )

        Back ->
            ( model, Interpreter.back() )

        Reset ->
            ( model, Interpreter.reset() )

        Edit ->
            ( { model | mode = Editing }, Cmd.none )

        Run ->
            ( model, Interpreter.setCode model.code )

        SetModeToRun ->
            ( { model | mode = Running }, Cmd.none )

        StateChanged { pc, memoryView } ->
            ( { model | pc = pc, memoryView = memoryView }, Cmd.none )

        InputRequested ->
            ( model, Cmd.none )

        Output value ->
            ( { model | outputStack = value :: model.outputStack }, Cmd.none )

        UndoOutput ->
            ( { model | outputStack = List.drop 1 model.outputStack }, Cmd.none )

        ClearOutput ->
            ( { model | outputStack = [] }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Interpreter.setCodeFinished (always SetModeToRun)
        , Interpreter.stateUpdated StateChanged
        , Interpreter.inputRequested (always InputRequested)
        , Interpreter.output Output
        , Interpreter.undoOutput (always UndoOutput)
        , Interpreter.clearOutput (always ClearOutput)
        ]


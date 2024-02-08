import PageTitle from "@renderer/core/page/PageTitle";
import Page from "../../core/page/Page";
import PageInnerHeader from "@renderer/core/page/PageInnerHeader";
import PageBody from "@renderer/core/page/PageBody";
import Divider from "@renderer/core/page/Divider";
import { Heading2 } from "./Heading2";
import { Heading3 } from "./Heading3";
import { ProfilePicker } from "./ProfilePicker";
import { Paragraph } from "./Paragraph";
import { KeySelector } from "./KeySelector";
import LinkButton from "@renderer/core/LinkButton";
import { useEffect, useReducer } from "react";
import Select, { SelectOption } from "@renderer/core/Select";
import { Switch } from "@renderer/core/Switch";
import { KeyCombo } from "@root/shared/types";
import { FPS_OPTIONS, RESOLUTION_OPTIONS, Settings as SettingsType, TIMEFRAME_OPTIONS, defaultSettings } from "@root/shared/settings";

type SettingsState = {
  frameRate: SelectOption,
  highlightTimeframe: SelectOption,
  recordMic: boolean,
  resolution: SelectOption,
  shortcutKey: KeyCombo
}

type ReducerAction = {
  action: "SET_FRAMERATE" | "SET_TIMEFRAME" | "SET_RESOLUTION",
  value: SelectOption
} | {
  action: "SET_RECORD_MIC",
  value: boolean
} | {
  action: "SET_SHORTCUT",
  value: KeyCombo
} | {
  action: "SET",
  value: SettingsState
}

const saveState = (state: SettingsState) => {
  window.api.settings.set({
    frameRate: state.frameRate.id as number,
    highlightTimeframe: state.highlightTimeframe.id as number,
    recordMic: state.recordMic,
    resolution: state.resolution.id as number,
    shortcutKey: state.shortcutKey
  });
}

const reducer = (state: SettingsState, action: ReducerAction) => {
  let newState: SettingsState;
  switch (action.action) {
    case "SET_TIMEFRAME":
      newState = {
        ...state,
        highlightTimeframe: action.value
      }
      saveState(newState);
      return newState;
    case "SET_RECORD_MIC":
      newState = {
        ...state,
        recordMic: action.value
      }
      saveState(newState);
      return newState;
    case "SET_RESOLUTION":
      newState = {
        ...state,
        resolution: action.value
      }
      saveState(newState);
      return newState;
    case "SET_SHORTCUT":
      newState = {
        ...state,
        shortcutKey: action.value
      }
      saveState(newState);
      return newState;
    case "SET_FRAMERATE":
      newState = {
        ...state,
        frameRate: action.value
      }
      saveState(newState);
      return newState;
    case "SET":
      return action.value
  }
}

const Settings = () => {

  const fpsOptions: SelectOption[] = Object.keys(FPS_OPTIONS).map((k) => {
    return {
      id: Number(k),
      value: FPS_OPTIONS[k],
      onClick: (value) => dispatch({ action: "SET_FRAMERATE", value })
    }
  })

  const resolutionOptions: SelectOption[] = Object.keys(RESOLUTION_OPTIONS).map((k) => {
    return {
      id: Number(k),
      value: RESOLUTION_OPTIONS[k],
      onClick: (value) => dispatch({ action: "SET_RESOLUTION", value })
    }
  })

  const timeframeOptions: SelectOption[] = Object.keys(TIMEFRAME_OPTIONS).map((k) => {
    return {
      id: Number(k),
      value: TIMEFRAME_OPTIONS[k],
      onClick: (value) => dispatch({ action: "SET_TIMEFRAME", value })
    }
  })

  const settingsToState = (settings: SettingsType) => {
    return {
      frameRate: fpsOptions.find(opt => opt.id === settings.frameRate) as SelectOption,
      resolution: resolutionOptions.find(opt => opt.id === settings.resolution) as SelectOption,
      highlightTimeframe: timeframeOptions.find(opt => opt.id === settings.highlightTimeframe) as SelectOption,
      recordMic: settings.recordMic,
      shortcutKey: settings.shortcutKey
    }
  }

  const [state, dispatch] = useReducer(reducer, settingsToState(defaultSettings));

  useEffect(() => {
    const settings = window.api.settings.get();
    
    if (settings) {
      dispatch({
        action: "SET", 
        value: settingsToState(settings)
      })
    }
  }, [])

  return ( 
    <Page>
      <PageInnerHeader className="sticky top-0 bg-woodsmoke-900 z-50 pb-3">
        <PageTitle>
          Settings
        </PageTitle>
        <Divider/>
      </PageInnerHeader>
      <PageBody className="grid grid-cols-2 gap-x-12 pb-12">
        
        <Heading2 className="col-span-full"> Account Settings </Heading2>
        <div>
          <Heading3> Profile </Heading3>
          <ProfilePicker className="mt-1"/>
        </div>

        <div className="flex flex-col">
          <Heading3> Password </Heading3>
          <Paragraph className="mb-5">
            An email will be sent containing the directions on how to change your password.
          </Paragraph>
          <LinkButton className="bg-woodsmoke-400 py-[9px] hover:bg-woodsmoke-100" to=''>
            Change Password
          </LinkButton>
        </div>

        <Heading2 className="col-span-full mt-12"> Recording Settings </Heading2>
        <div>
          <Heading3> Frame Rate </Heading3>
          <Paragraph>
            The frame rate at which matches are recorded. Higher frame rate leads to better quality, but uses more space and resources.
          </Paragraph>
          <Select width={118} className="mt-5" value={state.frameRate} options={fpsOptions}/>
        </div>

        <div>
          <Heading3> Record Microphone </Heading3>
          <Paragraph>
            Include audio from your microphone in the recordings.
          </Paragraph>
          <Switch rootClass="mt-5" value={state.recordMic} onChange={(value) => dispatch({ action: "SET_RECORD_MIC", value })}/>
        </div>

        <div className="mt-9">
          <Heading3> Resolution </Heading3>
          <Paragraph>
            The resolution at which matches are recorded. Higher resolution leads to better quality, but uses more space and resources.
          </Paragraph>
          <Select width={156} className="mt-5" value={state.resolution} options={resolutionOptions}/>
        </div>

        <div className="mt-9">
          <Heading3> Highlight Time Frame </Heading3>
          <Paragraph>
            The length of the highlight captured when pressing the <b> shortcut key. </b>  
          </Paragraph>
          <Select width={156} className="mt-5" value={state.highlightTimeframe} options={timeframeOptions}/>
        </div>

        <div className="mt-9">
          <Heading3> Shortcut Key </Heading3>
          <Paragraph>
            A mouse or keyboard key combination which can be pressed during the to create a highlight.
            Pressing this key will capture a clip in reverse based on the <b> highlight time frame </b> you have selected.
          </Paragraph>
          <KeySelector className="mt-5" value={state.shortcutKey} onChange={(value) => dispatch({ action: "SET_SHORTCUT", value })}/>
        </div>

      </PageBody>
    </Page>
  )
}

export default Settings;
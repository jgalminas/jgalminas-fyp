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
import { useEffect, useState } from "react";
import Select, { SelectOption } from "@renderer/core/Select";
import { Switch } from "@renderer/core/Switch";
import { KeyCombo } from "@root/shared/types";

type SettingsState = {
  frameRate: SelectOption,
  highlightTimeframe: SelectOption,
  recordMic: boolean,
  resolution: SelectOption,
  shortcutKey: KeyCombo
}

const Settings = () => {

  const fpsOptions: SelectOption[] = [
    {
      id: 30,
      value: "30 FPS",
      onClick: (v) => setFps(v)
    },
    {
      id: 60,
      value: "60 FPS",
      onClick: (v) => setFps(v)
    }
  ];

  const resolutionOptions: SelectOption[] = [
    {
      id: 720,
      value: "1280 x 720",
      onClick: (v) => setResolution(v)
    },
    {
      id: 1080,
      value: "1920 x 1080",
      onClick: (v) => setResolution(v)
    }
  ];

  const timeframeOptions: SelectOption[] = [
    {
      id: 15,
      value: "15 seconds",
      onClick: (v) => setTimeframe(v)
    },
    {
      id: 30,
      value: "30 seconds",
      onClick: (v) => setTimeframe(v)
    },
    {
      id: 45,
      value: "45 seconds",
      onClick: (v) => setTimeframe(v)
    },
    {
      id: 60,
      value: "60 seconds",
      onClick: (v) => setTimeframe(v)
    },
    {
      id: 120,
      value: "120 seconds",
      onClick: (v) => setTimeframe(v)
    }
  ];

  const settings = window.api.settings.get();

  const [fps, setFps] = useState<SelectOption>(fpsOptions[0]);
  const [resolution, setResolution] = useState<SelectOption>(resolutionOptions[0]);
  const [timeframe, setTimeframe] = useState<SelectOption>(timeframeOptions[0]);
  const [recordMic, setRecordMic] = useState<boolean>(false);
  const [key, setKey] = useState<KeyCombo>({ key: 'c', ctrlKey: true, shiftKey: false });

  // const [settings, setSettings] = useState<SettingsState>(
  //   (() => {
  //     const data = window.api.settings.get();
  //     return {
  //       frameRate: fpsOptions.find(opt => opt.id === settings?.frameRate) ?? fpsOptions[0],
  //       resolution: resolutionOptions.find(opt => opt.id === settings?.resolution) ?? resolutionOptions[0],
  //       highlightTimeframe: timeframeOptions.find(opt => opt.id === settings?.highlightTimeframe) ?? timeframeOptions[0],
  //       recordMic: data?.recordMic ?? false,
  //       shortcutKey: settings?.shortcutKey
  //     }
  //   })
  // );

  useEffect(() => {
    const settings = window.api.settings.get();

    if (settings) {
      setFps(fpsOptions.find(opt => opt.id === settings.frameRate) ?? fpsOptions[0]);
      setResolution(resolutionOptions.find(opt => opt.id === settings.resolution) ?? resolutionOptions[0]);
      setTimeframe(timeframeOptions.find(opt => opt.id === settings.highlightTimeframe) ?? timeframeOptions[0]);
      setRecordMic(settings.recordMic);
      setKey(settings.shortcutKey);
    }

  }, [])

  useEffect(() => {
    window.api.settings.set({
      frameRate: 9000,
      highlightTimeframe: timeframe.id as number,
      recordMic: recordMic,
      resolution: resolution.id as number,
      shortcutKey: key
    });
    console.log("saved");
    

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
          <Select width={118} className="mt-5" value={fps} options={fpsOptions}/>
        </div>

        <div>
          <Heading3> Record Microphone </Heading3>
          <Paragraph>
            Include audio from your microphone in the recordings.
          </Paragraph>
          <Switch rootClass="mt-5" value={recordMic} onChange={setRecordMic}/>
        </div>

        <div className="mt-9">
          <Heading3> Resolution </Heading3>
          <Paragraph>
            The resolution at which matches are recorded. Higher resolution leads to better quality, but uses more space and resources.
          </Paragraph>
          <Select width={156} className="mt-5" value={resolution} options={resolutionOptions}/>
        </div>

        <div className="mt-9">
          <Heading3> Highlight Time Frame </Heading3>
          <Paragraph>
            The length of the highlight captured when pressing the <b> shortcut key. </b>  
          </Paragraph>
          <Select width={156} className="mt-5" value={timeframe} options={timeframeOptions}/>
        </div>

        <div className="mt-9">
          <Heading3> Shortcut Key </Heading3>
          <Paragraph>
            A mouse or keyboard key combination which can be pressed during the to create a highlight.
            Pressing this key will capture a clip in reverse based on the <b> highlight time frame </b> you have selected.
          </Paragraph>
          <KeySelector className="mt-5" value={key} onChange={setKey}/>
        </div>

      </PageBody>
    </Page>
  )
}

export default Settings;
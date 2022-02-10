import * as React from 'react';
import { COLOR_BLACK, COLOR_BLUE, COLOR_GRAY, Global } from './components/global';
import {FluidVSplit, Panel, Span, Split} from './components/layout';
import { Navbar, NavbarButton, NavbarIcon } from './components/navbar';
import { Appahead } from './components/appahead';
import { TapePanel } from './components/tapepanel';

import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faBarcodeRead, faBarcodeScan, faCog, faDatabase, faList } from '@fortawesome/pro-light-svg-icons';

import { invoke }  from '@tauri-apps/api';

export const App = () => {
  const [ input, setInput ] = React.useState<string>("");

  return (
    <>
      <Global />
      <Split row>
        <Split>
          <Navbar row>
            <NavbarIcon>
              <Appahead />
            </NavbarIcon>
          </Navbar>
          <Panel vertical='Center' horizontal='Left'>
            <Span color={COLOR_BLACK} size={36}>Taper</Span><Span color={COLOR_GRAY} size={36} space={10}>|</Span><Span color={COLOR_BLUE} size={36}>Scanner</Span>
          </Panel>
        </Split>
        <Split grow>
          <Navbar row>
            <NavbarButton>
              <Icon icon={faBarcodeRead} />
            </NavbarButton>
            <NavbarButton active>
              <Icon icon={faList} />
            </NavbarButton>
            <NavbarButton>
              <Icon icon={faDatabase} />

            </NavbarButton>
            <NavbarButton>
              <Icon icon={faCog} />

            </NavbarButton>
          </Navbar>
          <FluidVSplit grow center items="Top">
            <TapePanel />
            <TapePanel />
          </FluidVSplit>
        </Split>
      </Split>

    </>
  )
}
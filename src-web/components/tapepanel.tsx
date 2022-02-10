import * as React from 'react';
import styled from 'styled-components';
import {COLOR_DARK, COLOR_LABEL, COLOR_WHITE} from "./global";


interface FlexProps {
  basis?: number
  ellipsis?: boolean
}

const TapePanelContainer = styled.div`
  margin: 1rem;
  width: 100%;
  border-radius: 5px;
  background-color: ${COLOR_WHITE};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  &:first-child {
    margin-right: 2.5px;
  }
  &last-child {
    margin-left: 2.5px;
  }
`

const TapePanelHeader = styled.div`
  background-color: #23272A;
  display: flex;
  align-items: stretch;
`

const flexBasis = (basis: number) => `flex-basis: ${basis}%;`;
const ellipsis = (enabled: boolean) => enabled ? `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
` : '';

const HeaderLabel = styled.span<FlexProps>`
  margin: 10px;
  font-size: 1.2rem;
  color: ${COLOR_LABEL};
  overflow: hidden;
  text-align: center;
  
  ${props => ellipsis(props.ellipsis)}
  ${props => props.basis > 0 ? flexBasis(props.basis) : ''}
`
HeaderLabel.defaultProps = {
  basis: 0,
  ellipsis: false,
}

const Divider = styled.div`
  width: 1.5px;
  background-color: ${COLOR_DARK};
`


export const TapePanel: React.FC = (props) => {

  return (
    <TapePanelContainer>
      <TapePanelHeader>
        <HeaderLabel>01</HeaderLabel>
        <Divider />
        <HeaderLabel ellipsis basis={30}>13:05:21</HeaderLabel>
        <Divider />
        <HeaderLabel ellipsis basis={60}>Freitag, 5. Oktober 2018</HeaderLabel>
      </TapePanelHeader>
      I are Tape</TapePanelContainer>
  )
}
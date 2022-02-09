import styled from 'styled-components';

const EasyAlignToFlex = {
  "Center": "Center",
  "Left": "Flex-Start",
  "Right": "Flex-End",
  "Top": "Flex-Start",
  "Bottom": "Flex-End"
}

interface SplitProps {
  row?: boolean;
  grow?: boolean;
}

export const Split = styled.div<SplitProps>`
  height: 100%;
  display: flex;
  
  flex-direction: ${props => props.row ? 'column' : 'row'};
  flex-basis: ${props => props.grow ? 100 : 0}%;
`

Split.defaultProps = {
  row: false,
  grow: false
}

interface PanelProps {
  vertical?: "Center" | "Top" | "Bottom"
  horizontal?: "Center" | "Left" | "Right"
  bg?: string
  color?: string
}

export const Panel = styled.div<PanelProps>`
  height: 100%;
  
  background-color: ${props => props.bg};
  color: ${props => props.color};
  
  display: flex;
  padding: 0 10px ;

  align-items: ${props => EasyAlignToFlex[props.vertical]};
  justify-content: ${props => EasyAlignToFlex[props.horizontal]};
  
  flex-grow: 1;
`

Panel.defaultProps = {
  horizontal: 'Center',
  vertical: 'Center',
  bg: "white",
  color: "black",
}

interface SpanProps {
  color?: string
  size?: number
  space?: number
}

export const Span = styled.span<SpanProps>`
  color: ${props => props.color};
  font-size: ${props => props.size > 0 ? `${props.size}px` : 'auto'};
  margin-left: ${props => props.space}px;
  margin-right: ${props => props.space}px;
`

Span.defaultProps = {
  color: "black",
  size: 0,
  space: 0,
}
import styled from 'styled-components';
import { COLOR_BLUE, COLOR_DARKEST } from './global';

import { Split } from './layout';


export const Navbar = styled(Split)`
  background-color: ${COLOR_DARKEST};
  width: 60px;
`

export const NavbarIcon = styled.div`
  display: flex;
  height: 60px;
  width: 60px;
  align-items: center;
  justify-content: center;
  padding: 10px 0 10px 0;
`

interface NavbarButtonProps {
  active?: boolean;
}

export const NavbarButton = styled.div<NavbarButtonProps>`
  display: flex;
  height: 60px;
  width: 60px;
  align-items: center;
  justify-content: center;

  background-color: ${props => props.active ? COLOR_BLUE : 'transparent'};
`
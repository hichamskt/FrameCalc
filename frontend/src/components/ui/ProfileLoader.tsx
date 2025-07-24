

import styled, { keyframes } from "styled-components";
const spin = keyframes`
  to { transform: rotate(1turn); }
`;

const Loader = styled.div`
  width:25px;
  height:25px;
  border-radius:50%;
  background:conic-gradient(#0000 10%,#000000);
  -webkit-mask:radial-gradient(farthest-side,#0000 calc(100% - 4px),#000 0);
  animation: ${spin} 1s infinite linear;
`;




function ProfileLoader() {
  return (
    <Loader/>
  )
}

export default ProfileLoader

import styled, { keyframes } from "styled-components";
const spin = keyframes`
  to { transform: rotate(1turn); }
`;
const Loader = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 8px solid;
  border-color: #E4E4ED;
  border-right-color: #766DF4;
  animation: ${spin} 1s infinite linear;
`;

 

function Loadingpage() {
  return (
    <div className="bg-black flex justify-center items-center h-screen w-full">
       <Loader />
    </div>
  )
}

export default Loadingpage
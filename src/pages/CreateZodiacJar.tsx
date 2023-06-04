
import { SingleColumnLayout } from "@daohaus/ui";
import { MintFormZodiac } from "../components/MintFormZodiac";
import styled from "styled-components";
import safeLogo from "../assets/safe.png";
const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 40rem;
  margin-bottom: 5rem;
  .img-block {
    display: flex;
    height: 24rem;
    width: 24rem;
  }
  img {
    height: 40rem;
    width: 60rem;
  }
`;

export type FormStates = "idle" | "loading" | "success" | "error";

export const CreateZodiacJar = () => {
  return (
    <>
      <SingleColumnLayout>
        <ImageContainer>
          <div className="img-block">
            <img src={safeLogo} />
          </div>
        </ImageContainer>
        <MintFormZodiac />
      </SingleColumnLayout>
    </>
  );
};

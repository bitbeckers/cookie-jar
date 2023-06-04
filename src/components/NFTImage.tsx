import { ParMd } from "@daohaus/ui";
import styled from "styled-components";

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
    width: 40rem;
  }
`;

export const NFTImage = ({ tokenId }: { tokenId: string }) => {
  // TODO: don't hard code this
  // link to animation
  const nft =
    "https://ipfs.io/ipfs/Qme4HsmWQSmShQ3dDPZGD8A5kyTPceTEP5dVkWnsMHhC2Z/";
  return (
    <ImageContainer>
      <div className="img-block">
        <img src={`${nft}${tokenId}.png`} />
      </div>
      <ParMd>next tokenId: {tokenId}</ParMd>
    </ImageContainer>
  );
};

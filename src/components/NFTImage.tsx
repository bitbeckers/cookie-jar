import React from "react";
import styled from "styled-components";

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
  margin-bottom: 2rem;
  .img-block {
    display: flex;
    height: 12rem;
    width: 12rem;
  }
  img {
    height: 20rem;
    width: 20rem;
  }
`;

export const NFTImage = ({ tokenId }: { tokenId: string }) => {
  const nft =
    "https://ipfs.io/ipfs/QmWn8CP5AnqmPU2zKWZesk6EFhzk5zj72mdDQEaTPmwezF/";
  return (
    <ImageContainer>
      <div className="img-block">
        <img src={`${nft}${tokenId}.png`} />
      </div>
    </ImageContainer>
  );
};

import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  width: 100%;
  background: linear-gradient(135deg, #ece9e6, #ffffff);
  padding: 15px 0;
  text-align: center;
  color: gray;
  font-size: 14px;
  border-top: 1px solid #ddd;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const FooterLink = styled.a`
  color: blue;
  text-decoration: none;
  margin-left: 5px;
  &:hover {
    text-decoration: underline;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>
        Develop & Design da 
        <FooterLink
          href="https://www.maylea-digital.it"
          target="_blank"
          rel="noopener noreferrer"
        >
          Maylea Digital
        </FooterLink>
      </p>
    </FooterContainer>
  );
};

export default Footer;

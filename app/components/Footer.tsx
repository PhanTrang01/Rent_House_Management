import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import Link from "next/link";

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterText>
          <p>
            Powered & Designed with 💚 by <span>Phan Trang</span>
          </p>
          <Typography>
            {"Copyright © "}
            <Link
              color="inherit"
              href="https://www.facebook.com/ThuTrang.Phan0311/"
            >
              My Website
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </FooterText>
      </FooterContainer>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.div`
  background-color: #9fb1de;
  margin-top: 80px;
  position: fixed;
  bottom: 0;
  width: 100vw;
`;

const FooterContainer = styled.div`
  padding: 0 150px;
  p {
    color: rgb(60, 57, 57);
  }
  span {
    color: white;
    font-weight: bold;
  }
  @media (max-width: 1024px) {
    padding: 0 80px;
  }
`;

const FooterText = styled.div`
  padding: 25px 80px;
  text-align: center;
`;

export default Footer;

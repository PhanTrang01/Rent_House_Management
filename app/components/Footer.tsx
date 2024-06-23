import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import Link from "next/link";

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterText>
          <p>
            Đồ án tốt nghiệp 2023.2 - Trường Công nghệ Thông tin và Truyền thông
          </p>
          <Typography>
            Liên hệ:
            <Link
              color="inherit"
              href="https://www.facebook.com/ThuTrang.Phan0311/"
            >
              <span>Trang.ptt194691@sis.hust.edu.vn</span>
            </Link>{" "}
          </Typography>
        </FooterText>
      </FooterContainer>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.div`
  background-color: #9fb1de;
  /* margin-top: 25px; */
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
  padding: 5px 80px;
  text-align: center;
`;

export default Footer;

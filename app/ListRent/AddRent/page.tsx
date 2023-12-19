"use client";
import Dashboard from "@/app/components/Dashboard";
import Header from "@/app/components/Header";
import styled from "@emotion/styled";

export default function AddRent() {
  return (
    <Wrapper>
      <Dashboard />
      <WrapperContainer>
        <Header />
      </WrapperContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex: 1;
  height: 100hv;
`;

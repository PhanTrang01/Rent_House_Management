"use client";
import Dashboard from "@/app/components/Dashboard";
import Header from "@/app/components/Header";
import styled from "@emotion/styled";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import { homeContracts, homeowners } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

type contractRent = homeContracts;
type Owner = homeowners;

type DataCreateHomeContracts = {
  guest: string;
  owner: string;
  home: string;
  duration: number;
  rental: number;
  cycle: number;
};
// const options = ["Option 1", "Option 2"];

export default function AddRent() {
  const [age, setAge] = useState("");
  const [owners, setOwners] = useState<Owner[]>([]);
  // const [value, setValue] = useState<string | null>(options[0]);
  const [inputValue, setInputValue] = useState("");

  const [dataCreateHomeContracts, setCreateHomeContracts] =
    useState<DataCreateHomeContracts>({
      guest: "",
      owner: "",
      home: "",
      duration: 0,
      rental: 0,
      cycle: 0,
    });

  const initialOwner = owners.length > 0 ? owners[0] : null;

  useEffect(() => {
    axios.get("/api/owner").then(function (response) {
      setOwners(response.data);
    });
  }, []);

  // useEffect(() => {
  //   owners.map((owner) => {
  //     options.push(owner.fullName);
  //   });
  //   console.log(options);
  // });

  const handleChange = (event: SelectChangeEvent, name: string) => {
    setCreateHomeContracts({
      ...dataCreateHomeContracts,
      [name]: event.target.value,
    });
    console.log(dataCreateHomeContracts);
  };

  return (
    <Wrapper>
      <Dashboard />
      <WrapperContainer>
        <Header />

        <Paper
          elevation={3}
          sx={{
            // width: "1000px",
            textAlign: "center",
            padding: " 20px 50px",
            margin: "50px",
          }}
        >
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{
              maxWidth: "1200px",
              textAlign: "center",
            }}
          >
            <Grid item md={12} lg={6}>
              <Item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Name of Owner
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={dataCreateHomeContracts.owner}
                    label="Name of Owner"
                    onChange={(e) => handleChange(e, "owner")}
                  >
                    {owners.map((owner) => (
                      <MenuItem key={owner.homeOwnerId} value={owner.fullName}>
                        {owner.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item md={12} lg={6}>
              <Item>
                <Autocomplete
                  value={initialOwner}
                  onChange={(e) => handleChange(e as any, "owner")}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  id="controllable-states-demo"
                  options={owners}
                  getOptionKey={(option: { homeOwnerId: number }) =>
                    option.homeOwnerId
                  }
                  getOptionLabel={(option) => option.fullName}
                  renderInput={(params) => (
                    <TextField {...params} label="Controllable" />
                  )}
                />
              </Item>
            </Grid>
            <Grid item md={12} lg={6}>
              <Item>
                <TextField
                  margin="dense"
                  id="name"
                  label="Email Address"
                  type="email"
                  fullWidth
                  // onChange={(e) => {
                  //   setCreateOwner({ ...dataCreateOwner, name: e.target.value });
                  // }}
                />
              </Item>
            </Grid>
            <Grid item md={12} lg={6}>
              <Item>
                <TextField
                  margin="dense"
                  id="name"
                  label="Email Address"
                  type="email"
                  fullWidth
                  // onChange={(e) => {
                  //   setCreateOwner({ ...dataCreateOwner, name: e.target.value });
                  // }}
                />
              </Item>
            </Grid>
          </Grid>
        </Paper>
      </WrapperContainer>
    </Wrapper>
  );
}

const Item = styled(Paper)(() => ({
  backgroundColor: "#eaf4f4",
  padding: "20px",
  textAlign: "center",
}));

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex: 1;
  height: 100hv;
`;

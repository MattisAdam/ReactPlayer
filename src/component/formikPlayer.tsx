import { Formik, Field, FieldArray, Form, FormikErrors } from "formik";
import { PostPlayer, PlayerRequest, GetPlayerById, UpdatePlayer, DeleteAdresse, Player } from "../HttpRequest/PlayerRequest";
import DatePicker from "react-datepicker";
import { data, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";
import { Button, Typography, Box, Grid, TextField, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation, useQueryClient } from "@tanstack/react-query";




export interface PropsPlayerFormik {
  IsAddMode: boolean
  id: number
}



export const usePostPlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (player: Player) => {
      const data = await PostPlayer(player);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};


export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (player: Player) => {
      const data = await UpdatePlayer(player);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};


export const PlayerFormik = (props: PropsPlayerFormik) => {
  const navigate = useNavigate()

  let x;
  if (props.IsAddMode) {
    const initialValues = {
      id: 0,
      pseudo: '',
      birthDate: new Date(),
      addresses: []
    };
    console.log("CreateUser", initialValues)
    x = initialValues;
  }

  else {
    const { data: player } = GetPlayerById(props.id)
    console.log("Adresses", player?.addresses)
    const initialValues = {
      id: player?.id ?? 0,
      pseudo: player?.pseudo ?? '',
      birthDate: player?.birthDate ?? new Date(),
      addresses: player?.addresses ?? []
    };
    console.log("UpgradeUser", initialValues)
    x = initialValues;
  }

  return (
    <Formik<PlayerRequest>
      initialValues={x}
      onSubmit={async (values, { setErrors }) => {
        try {
          values.addresses.forEach((address) => {
            address.playerId = values.id;
          });


          if (props.IsAddMode) {
            await PostPlayer(values);
            toast.success("Player added successfully");
            navigate(-1);
          } else {
            await UpdatePlayer(values);
            toast.success("Player updated successfully");
            navigate(-1);
          }
        } catch (error: any) {
          console.error("Request failed", error?.response?.data?.Errors);

          if (Array.isArray(error?.response?.data?.Errors)) {
            const formattedErrors: Record<string, string> = {};
            error.response.data.Errors.forEach((err: any) => {
              if (err.PropertyName && err.ErrorMessage) {

                formattedErrors[err.PropertyName] = err.ErrorMessage;
              }
              toast.error(String(err.ErrorMessage || "Something went wrong"));
            });
            setErrors(formattedErrors);
          }
        }
      }}
    >
      {({ values, errors, setFieldValue, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Grid container spacing={3} direction="column">
              <Grid>
                <Typography variant="h5" textAlign="center">
                  {props.IsAddMode ? "Add Player" : "Update " + values.pseudo}
                </Typography>
              </Grid>

              <Grid >
                <Field
                  as={TextField}
                  name="pseudo"
                  label="Username"
                  fullWidth
                  error={Boolean(errors.pseudo)}
                  helperText={errors.pseudo}
                />
              </Grid>

              <Grid>
                <label style={{ display: 'block', marginBottom: 4 }}>Birthdate</label>
                <DatePicker
                  selected={values.birthDate}
                  onChange={(date: Date | null) => setFieldValue("birthDate", date)}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select a date"
                  className={`input-field ${errors.birthDate ? 'error' : ''}`}
                  showMonthDropdown
                  showYearDropdown
                  popperPlacement="bottom-start"
                  minDate={new Date("1900-01-01")}
                  maxDate={new Date()}
                />
                {errors.birthDate && (
                  <Typography color="error" fontSize="0.8rem">{errors.birthDate}</Typography>
                )}
              </Grid>

              <Grid >
                <FieldArray name="addresses">
                  {({ push, remove }) => (
                    <Box>
                      <Typography variant="subtitle1">
                        Address{values.addresses.length > 1 ? "es" : ""}
                      </Typography>
                      {values.addresses.length === 0 && (
                        <Typography>No address added</Typography>
                      )}

                      {values.addresses.map((_, index) => (
                        <Grid container spacing={2} alignItems="center" key={index}>
                          <Grid>
                            <Field
                              as={TextField}
                              name={`addresses[${index}].rue`}
                              placeholder="Street"
                              fullWidth
                              error={Boolean((errors.addresses as FormikErrors<{ rue: string }>[])?.[index]?.rue)}
                              helperText={(errors.addresses as FormikErrors<{ rue: string }>[])?.[index]?.rue}
                            />
                          </Grid>
                          <Grid >

                            <IconButton
                              onClick={async () => {
                                remove(index);
                              }}
                              sx={{ color: 'red', ml: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                      <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => push({ rue: "", playerId: values.id })}
                        sx={{ mt: 2 }}
                      >
                        Add Address
                      </Button>
                    </Box>
                  )}
                </FieldArray>
              </Grid>
              <Grid container justifyContent="space-between" mt={3}>
                <Button variant="contained" color="error" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button variant="contained" color="success" type="submit" disabled={isSubmitting} >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
}


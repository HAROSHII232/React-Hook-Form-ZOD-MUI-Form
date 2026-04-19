import {
  useFieldArray,
  useFormContext,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import {
  Button,
  Container,
  ListItemText,
  ListItem,
  Stack,
  List,
  ListItemButton,
  ListSubheader,
} from "@mui/material";
import type { Schema } from "../types/schema";
import { RHFAutocomplete } from "../../components/RHFAutocomplete";
import {
  useGenders,
  useLanguages,
  useSkills,
  useStates,
  useUser,
  useUsers,
} from "../services/queries";
import { RHFToogleButtonGroup } from "../../components/RHFToogleButtonGroup";
import { RHFRadioGroup } from "../../components/RHFRadioGroup";
import { RHFCheckbox } from "../../components/RHFCheckbox";
import { RHFDateTimePicker } from "../../components/RHFDateTimePicker";
import { RHFDateRangePicker } from "../../components/RHFDateRangePicker";
import { RHFSlider } from "../../components/RHFSlider";
import { RHFSwitch } from "../../components/RHFSwitch";
import { RHFTextField } from "../../components/RHFTextField";
import { Fragment, useEffect } from "react";
import { defaultValues } from "../types/schema";
import { useCreateUser, useEditUser } from "../services/mutations";

export function Users() {
  const { data: states } = useStates();
  const { data: languages } = useLanguages();
  const { data: genders } = useGenders();
  const { data: skills } = useSkills();
  const { data: users } = useUsers();
  const { control, unregister, reset, setValue, handleSubmit } =
    useFormContext<Schema>();

  const id = useWatch({ control, name: "id" });
  const userQuery = useUser(id);

  const isTeacher = useWatch({ control, name: "isTeacher" });
  const variant = useWatch({ control, name: "variant" });

  const { fields, append, remove, replace } = useFieldArray({
    control: control,
    name: "students",
  });

  const handleUserClick = (id: string) => {
    setValue("id", id);
  };

  useEffect(() => {
    if (!isTeacher) {
      replace([]);
      unregister("students");
    }
  }, [isTeacher, replace, unregister]);

  useEffect(() => {
    if (userQuery.data) {
      reset(userQuery.data);
    }
  }, [reset, userQuery.data]);

  const handleReset = () => {
    reset(defaultValues);
  };

  const createUserMutation = useCreateUser();
  const editUserMutation = useEditUser();

  const onSubmit: SubmitHandler<Schema> = (data) => {
    if (data.variant === "create") {
      createUserMutation.mutate(data);
    } else {
      editUserMutation.mutate(data);
    }
  };

  return (
    <Container maxWidth="sm" component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ flexDirection: "row", gap: 2 }}>
        <List subheader={<ListSubheader>Users</ListSubheader>}>
          {users?.map((user) => (
            <ListItem disablePadding key={user.id}>
              <ListItemButton
                onClick={() => handleUserClick(user.id)}
                selected={id === user.id}
              >
                <ListItemText primary={user.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Stack sx={{ gap: 2 }}>
          <RHFTextField<Schema> name="name" label="Name" />
          <RHFTextField<Schema> name="email" label="Email" />
          <RHFAutocomplete<Schema>
            name="states"
            options={states}
            label="State"
          />
          <RHFToogleButtonGroup<Schema> name="languages" options={languages} />
          <RHFRadioGroup<Schema>
            name="gender"
            options={genders}
            label="Gender"
          />
          <RHFCheckbox<Schema> name="skills" options={skills} label="Skills" />
          <RHFDateTimePicker<Schema>
            name="registrationDateAndTime"
            label="Registration Date and Time"
          />
          <RHFDateRangePicker<Schema>
            name="formerEmploymentPeriod"
            label="Former Employment Period"
          />
          <RHFSlider<Schema> name="salaryRange" label="Salary Range" />
          <RHFSwitch<Schema> name="isTeacher" label="Are you a teacher?" />

          {isTeacher && (
            <Button onClick={() => append({ name: "" })} type="button">
              Add new Student
            </Button>
          )}

          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <RHFTextField<Schema>
                name={`students.${index}.name`}
                label="Name"
              />
              <Button
                color="error"
                onClick={() => {
                  remove(index);
                }}
                type="button"
              >
                Remove
              </Button>
            </Fragment>
          ))}

          <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button type="submit" variant="contained">
              {variant === "create" ? "Create User" : "Update User"}
            </Button>
            <Button type="reset" variant="outlined" onClick={handleReset}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}

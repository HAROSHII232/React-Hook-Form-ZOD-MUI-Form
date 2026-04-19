import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Option } from "../../types/option";
import { env } from "../../config/env";
import type { ApiGet } from "../types/apiTypes";
import type { Schema } from "../types/schema";

const useOptionsQuery = (resource: string) =>
  useQuery({
    queryKey: [resource],
    queryFn: () =>
      axios.get<Option[]>(`${env.API_URL}/${resource}`).then((res) => res.data),
  });

export const useStates = () => useOptionsQuery("states");
export const useLanguages = () => useOptionsQuery("languages");
export const useGenders = () => useOptionsQuery("genders");
export const useSkills = () => useOptionsQuery("skills");

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: (): Promise<Option[]> =>
      axios.get<ApiGet[]>(`${env.API_URL}/users`).then((res) =>
        res.data.map((user) => {
          return {
            id: user.id.toString(),
            label: user.name,
          };
        }),
      ),
  });

export const useUser = (id: string) =>
  useQuery({
    queryKey: ["user", { id }],
    queryFn: async (): Promise<Schema> => {
      const { data } = await axios.get<ApiGet>(`${env.API_URL}/users/${id}`);

      return {
        variant: "edit",
        id: data.id.toString(),
        name: data.name,
        email: data.email,
        formerEmploymentPeriod: [
          new Date(data.formerEmploymentPeriod[0]),
          new Date(data.formerEmploymentPeriod[1]),
        ],
        gender: data.gender,
        languages: data.languages,
        registrationDateAndTime: new Date(data.registrationDateAndTime),
        salaryRange: [data.salaryRange[0], data.salaryRange[1]],
        skills: data.skills,
        states: data.states,
        students: data.students,
        isTeacher: data.isTeacher,
      };
    },
    enabled: !!id,
  });

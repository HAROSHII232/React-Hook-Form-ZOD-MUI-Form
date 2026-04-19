import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Schema } from "../types/schema";
import axios from "axios";
import { env } from "../../config/env";
import { mapData } from "../utils/mapData";
import omit from "lodash/omit";

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: Schema) =>
      await axios.post(`${env.API_URL}/users`, omit(mapData(user), "variant")),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      alert(`User ${variables.name} created successfully`);
    },
  });
}

export function useEditUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: Schema) => {
      if (user.variant === "edit") {
        return await axios.put(
          `${env.API_URL}/users/${user.id}`,
          omit(mapData(user), "variant"),
        );
      }
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      if (variables.variant === "edit") {
        await queryClient.invalidateQueries({
          queryKey: ["user", { id: variables.id }],
        });
      }
      alert(`User ${variables.name} updated successfully`);
    },
  });
}

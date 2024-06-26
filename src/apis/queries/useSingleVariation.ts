import { useQuery } from "@tanstack/react-query";
import { fetchVariationById } from "../variation-service";

export const useSingleVariation = (variationId: string) => {
  return useQuery({
    queryKey: [variationId],
    queryFn: () => fetchVariationById(variationId),
  });
};

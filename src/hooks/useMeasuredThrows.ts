import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_MEASURED_THROW,
  DELETE_MEASURED_THROW,
} from "src/graphql/mutation";
import { GET_USER_WITH_THROWS } from "src/graphql/queries";
import { MeasuredThrow } from "src/types/throws";

type QueryResponse = {
  getMe: {
    measuredThrows: MeasuredThrow[];
  };
};

export const useMeasuredThrows = () => {
  const { data, loading, error } = useQuery<QueryResponse>(
    GET_USER_WITH_THROWS,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const [addMeasuredThrow] = useMutation(ADD_MEASURED_THROW, {
    refetchQueries: [{ query: GET_USER_WITH_THROWS }],
  });

  const [deleteMeasuredThrow] = useMutation(DELETE_MEASURED_THROW, {
    refetchQueries: [{ query: GET_USER_WITH_THROWS }],
  });

  return {
    throws: data?.getMe.measuredThrows ?? [],
    loading,
    error,
    addMeasuredThrow,
    deleteMeasuredThrow,
  };
};

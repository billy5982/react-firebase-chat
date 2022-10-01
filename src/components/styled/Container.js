import styled from "styled-components";

export const Container = styled.div`
  background-color: ${({ backgroundC }) => backgroundC || "initial"};
  color: ${({ color }) => color || "initial"};

  padding: ${({ padding }) => padding || "initial"};
  margin: ${({ margin }) => margin || "initial"};
  overflow: ${({ overflowY }) => overflowY || "initial"};

  min-height: ${({ minHeight }) => minHeight || "initial"};
  min-width: ${({ minWidth }) => minWidth || "initial"};
  width: ${({ width }) => width || "initial"};
  height: ${({ height }) => height || "initial"};

  border: ${({ border }) => border || "initial"};
  border-radius: ${({ borderR }) => borderR || "0"};
`;

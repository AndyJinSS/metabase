// eslint-disable-next-line no-restricted-imports
import styled from "@emotion/styled";

import { Form } from "metabase/forms";

export const TokenAuthForm = styled(Form)`
  margin: 0 1rem;
  max-width: 32.5rem;
`;

export const TokenAuthHeader = styled.h2`
  margin-top: 1rem;
`;

export const TokenAuthFormCaption = styled.p`
  color: var(--mb-color-text-medium);
`;

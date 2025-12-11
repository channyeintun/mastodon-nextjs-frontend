import styled from '@emotion/styled';
import type { ReactNode } from 'react';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--size-2);
`;

const Label = styled.label`
  font-size: var(--font-size-1);
  font-weight: 600;
  color: var(--text-1);
`;

const RequiredMark = styled.span`
  color: var(--red-6);
  margin-left: 4px;
`;

const Description = styled.p`
  font-size: var(--font-size-0);
  color: var(--text-2);
  margin: 0;
`;

const ErrorText = styled.span`
  font-size: var(--font-size-0);
  color: var(--red-6);
`;

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  description,
  children,
}: FormFieldProps) {
  return (
    <Container>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <RequiredMark>*</RequiredMark>}
      </Label>

      {description && <Description>{description}</Description>}

      {children}

      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
}

import styled from '@emotion/styled'

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--size-3);
  padding: var(--size-4);
  background: var(--surface-1);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: var(--shadow-2);
`

export const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--size-2);
  flex: 1;
`

export const HeaderTitle = styled.h1`
  font-size: var(--font-size-3);
  margin: 0;
  font-weight: 600;
`

export const HeaderSubtitle = styled.p`
  font-size: var(--font-size-0);
  color: var(--text-2);
  margin: 0;
`

export const FallbackTitle = styled.h1`
  font-size: var(--font-size-4);
  margin: 0;
  flex: 1;
`

export const PageTitle = styled.h1`
  font-size: var(--font-size-4);
  margin: 0;
`

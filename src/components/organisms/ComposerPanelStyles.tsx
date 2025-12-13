import styled from '@emotion/styled';

// Styled components
export const LoadingContainer = styled.div`
  padding: var(--size-4);
  text-align: center;
  color: var(--text-2);
`;

export const DisplayName = styled.div`
  font-weight: var(--font-weight-7);
  font-size: var(--font-size-2);
`;

export const VisibilityButtonWrapper = styled.div`
  margin-top: 4px;
`;

export const VisibilityButton = styled.button`
  padding: 0;
  background: transparent;
  color: var(--text-2);
  font-size: var(--font-size-1);
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border: none;

  &:hover {
    color: var(--text-1);
  }
`;

export const VisibilityLabel = styled.span`
  font-weight: 500;
`;

export const InputsContainer = styled.div`
  margin-bottom: var(--size-3);
  display: flex;
  flex-direction: column;
  gap: var(--size-2);
`;

export const QuotePreview = styled.div`
  margin-top: var(--size-4);
  pointer-events: none;
  user-select: none;
  opacity: 0.8;
`;

// Compact Media Preview for Reply Mode (similar to chat page design)
export const CompactMediaPreviewContainer = styled.div`
  display: flex;
  gap: var(--size-2);
  padding: var(--size-2) 0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CompactMediaPreviewItem = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-2);
  overflow: hidden;
  background: var(--surface-3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
  }
  
  &:hover .compact-media-controls {
    opacity: 1;
  }
`;

export const CompactMediaPreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const CompactMediaPreviewControls = styled.div`
  position: absolute;
  top: var(--size-1);
  right: var(--size-1);
  display: flex;
  gap: var(--size-1);
  opacity: 0;
  transition: opacity 0.2s ease;
`;

export const CompactMediaPreviewButton = styled.button`
  width: 20px;
  height: 20px;
  border-radius: var(--radius-round);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background 0.2s ease, transform 0.2s ease;
  
  &:hover {
    background: var(--red-9);
    transform: scale(1.1);
  }
`;

export const CompactUploadingIndicator = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-3);
  border-radius: var(--radius-2);
  flex-shrink: 0;
`;
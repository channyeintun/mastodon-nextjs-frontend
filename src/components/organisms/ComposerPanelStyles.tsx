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
  padding: var(--size-3) 0;
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
  width: 72px;
  height: 72px;
  border-radius: var(--radius-3);
  overflow: hidden;
  background: var(--surface-3);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s var(--ease-out-3), box-shadow 0.25s var(--ease-out-3);
  
  &:hover {
    transform: scale(1.05) translateY(-2px);
    box-shadow: 
      0 8px 20px rgba(0, 0, 0, 0.18),
      0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:hover .compact-media-controls {
    opacity: 1;
    transform: scale(1);
  }
  
  &:hover img {
    transform: scale(1.08);
  }
`;

export const CompactMediaPreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.25s ease;
`;

export const CompactMediaPreviewControls = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  display: flex;
  gap: var(--size-1);
  opacity: 0;
  transition: 
    opacity 0.2s ease,
    transform 0.2s ease;
`;

export const CompactMediaPreviewButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: var(--radius-round);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: var(--red-9);
    transform: scale(1.15);
  }
`;

export const CompactUploadingIndicator = styled.div`
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--surface-3) 0%, var(--surface-4) 100%);
  border-radius: var(--radius-3);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  
  /* Shimmer effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.08) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;
/**
 * Styled components for media preview in conversations
 */

import styled from '@emotion/styled'

export const MediaPreviewContainer = styled.div`
  position: fixed;
  position-anchor: --attach-button;
  bottom: anchor(top);
  left: anchor(left);
  display: flex;
  gap: var(--size-2);
  padding: var(--size-2);
  overflow-x: auto;
  background: rgba(var(--surface-1-rgb, 20, 20, 24), 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--surface-3);
  border-radius: var(--radius-3);
  scrollbar-width: none;
  -ms-overflow-style: none;
  z-index: 11;
  margin-bottom: var(--size-4);
  max-width: calc(100vw - var(--size-8));
  
  &::-webkit-scrollbar {
    display: none;
  }
`

export const MediaPreviewItem = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: var(--radius-3);
  overflow: hidden;
  background: var(--surface-3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:hover .media-preview-controls {
    opacity: 1;
  }
`

export const MediaPreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

export const MediaPreviewControls = styled.div`
  position: absolute;
  top: var(--size-1);
  right: var(--size-1);
  display: flex;
  gap: var(--size-1);
  opacity: 0;
  transition: opacity 0.2s ease;
`

export const MediaPreviewOverlayButton = styled.button`
  width: 24px;
  height: 24px;
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
`

export const RemoveMediaButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--red-9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`

export const UploadingIndicator = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-3);
  border-radius: var(--radius-3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`

export const AttachButton = styled.button`
  anchor-name: --attach-button;
  background: transparent;
  border: none;
  color: var(--text-2);
  cursor: pointer;
  padding: var(--size-2);
  border-radius: var(--radius-2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  
  &:hover:not(:disabled) {
    background: var(--surface-3);
    color: var(--text-1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const HiddenInput = styled.input`
  display: none;
`

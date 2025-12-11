'use client';

import styled from '@emotion/styled';
import { ChevronUp } from 'lucide-react';

const Button = styled.button<{ $visible: boolean }>`
    position: sticky;
    bottom: var(--size-6);
    left: 50%;
    transform: translateX(-50%) translateY(${props => props.$visible ? '0' : '100px'});
    opacity: ${props => props.$visible ? 1 : 0};
    visibility: ${props => props.$visible ? 'visible' : 'hidden'};
    transition: transform 0.3s ease, opacity 0.3s ease;
    background: var(--blue-6);
    color: white;
    border: none;
    border-radius: var(--radius-round);
    padding: var(--size-3) var(--size-4);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--size-2);
    box-shadow: var(--shadow-4);
    z-index: 100;
    font-size: var(--font-size-0);
    font-weight: 500;
    pointer-events: ${props => props.$visible ? 'auto' : 'none'};

    &:hover {
        background: var(--blue-7);
    }
`;

interface ScrollToTopButtonProps {
    visible: boolean;
    onClick: () => void;
}

export function ScrollToTopButton({ visible, onClick }: ScrollToTopButtonProps) {
    return (
        <Button
            $visible={visible}
            onClick={onClick}
            aria-label="Scroll to top"
        >
            <ChevronUp size={16} />
            Back to top
        </Button>
    );
}

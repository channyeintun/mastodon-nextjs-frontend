'use client';

import styled from '@emotion/styled';

interface SwitchProps {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
}

const SwitchContainer = styled.label<{ disabled?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-3);
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    padding: var(--size-3);
    border-radius: var(--radius-2);
    transition: background 0.2s var(--ease-2);

    &:hover {
        background: var(--surface-2);
    }
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--size-1);
    flex: 1;
`;

const Label = styled.div`
    font-weight: var(--font-weight-6);
    color: var(--text-1);
    font-size: var(--font-size-1);
`;

const Description = styled.div`
    font-size: var(--font-size-0);
    color: var(--text-2);
`;

const SwitchTrack = styled.div<{ $checked: boolean; $disabled: boolean }>`
    --thumb-size: var(--size-4);
    --track-padding: 2px;
    --track-width: calc(var(--thumb-size) * 2);
    --track-height: calc(var(--thumb-size) + (var(--track-padding) * 2));

    width: var(--track-width);
    height: var(--track-height);
    background: ${props => props.$checked ? 'var(--blue-6)' : 'var(--surface-4)'};
    border-radius: 999px;
    position: relative;
    transition: background 0.3s var(--ease-3);
    flex-shrink: 0;
    opacity: ${props => props.$disabled ? 0.6 : 1};

    &::after {
        content: '';
        position: absolute;
        top: var(--track-padding);
        left: var(--track-padding);
        width: var(--thumb-size);
        height: var(--thumb-size);
        background: white;
        border-radius: 50%;
        transition: transform 0.3s var(--ease-out-3);
        transform: translateX(${props => props.$checked ? 'var(--thumb-size)' : '0'});
        box-shadow: var(--shadow-2);
    }
`;

const HiddenInput = styled.input`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
`;

/**
 * Switch component styled with Open Props variables
 */
export function Switch({ id, checked, onChange, label, description, disabled = false }: SwitchProps) {
    return (
        <SwitchContainer htmlFor={id} disabled={disabled}>
            {(label || description) && (
                <TextContainer>
                    {label && <Label>{label}</Label>}
                    {description && <Description>{description}</Description>}
                </TextContainer>
            )}
            <HiddenInput
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
            <SwitchTrack $checked={checked} $disabled={disabled} />
        </SwitchContainer>
    );
}

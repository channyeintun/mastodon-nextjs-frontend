'use client';

import type { ReactNode, CSSProperties } from 'react';

export interface TabItem<T extends string> {
    value: T;
    label: string;
    icon?: ReactNode;
}

export interface TabsProps<T extends string> {
    tabs: TabItem<T>[];
    activeTab: T;
    onTabChange: (tab: T) => void;
    variant?: 'underline' | 'pill';
    fullWidth?: boolean;
    sticky?: boolean;
    style?: CSSProperties;
    className?: string;
}

export function Tabs<T extends string>({
    tabs,
    activeTab,
    onTabChange,
    variant = 'underline',
    fullWidth = variant === 'underline',
    sticky = false,
    style,
    className = '',
}: TabsProps<T>) {
    const containerClass = [
        'tabs',
        `tabs--${variant}`,
        fullWidth ? 'tabs--full-width' : '',
        sticky ? 'tabs--sticky' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClass} role="tablist" style={style}>
            {tabs.map((tab) => {
                const isActive = tab.value === activeTab;
                const tabClass = [
                    'tab',
                    `tab--${variant}`,
                    isActive ? 'tab--active' : '',
                ].filter(Boolean).join(' ');

                return (
                    <button
                        key={tab.value}
                        className={tabClass}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onTabChange(tab.value)}
                        style={{
                            // Each active tab becomes an anchor for the indicator
                            anchorName: isActive ? '--active-tab' : undefined,
                        } as CSSProperties}
                    >
                        {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                        <span className="tab-label">{tab.label}</span>
                    </button>
                );
            })}
            {/* Sliding indicator - anchored to active tab */}
            {variant === 'underline' && (
                <div className="tab-indicator" aria-hidden="true" />
            )}
        </div>
    );
}

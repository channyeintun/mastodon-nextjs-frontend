import { Card, CheckboxField } from '@/components/atoms';

interface PrivacySettingsFormProps {
  locked: boolean;
  bot: boolean;
  discoverable: boolean;
  onLockedChange: (checked: boolean) => void;
  onBotChange: (checked: boolean) => void;
  onDiscoverableChange: (checked: boolean) => void;
}

export function PrivacySettingsForm({
  locked,
  bot,
  discoverable,
  onLockedChange,
  onBotChange,
  onDiscoverableChange,
}: PrivacySettingsFormProps) {
  return (
    <Card padding="medium" style={{ marginBottom: 'var(--size-4)' }}>
      <h2
        style={{
          fontSize: 'var(--font-size-3)',
          fontWeight: 'var(--font-weight-6)',
          marginBottom: 'var(--size-4)',
        }}
      >
        Privacy & Preferences
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--size-3)' }}>
        <CheckboxField
          id="locked"
          label="Locked Account"
          description="Manually approve followers"
          checked={locked}
          onChange={onLockedChange}
        />

        <CheckboxField
          id="bot"
          label="Bot Account"
          description="This account mainly performs automated actions"
          checked={bot}
          onChange={onBotChange}
        />

        <CheckboxField
          id="discoverable"
          label="Suggest Account to Others"
          description="Allow your account to be discovered"
          checked={discoverable}
          onChange={onDiscoverableChange}
        />
      </div>
    </Card>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useCurrentAccount, useUpdateAccount } from '@/api';
import { Button, IconButton } from '@/components/atoms';
import {
  ImageCropper,
  ProfileEditorSkeleton,
  ProfileImageUploader,
  ProfileFieldsEditor,
  PrivacySettingsForm,
} from '@/components/molecules';
import { useCropper } from '@/hooks/useCropper';

export default function ProfileEditPage() {
    const router = useRouter();
    const { data: currentAccount, isLoading } = useCurrentAccount();
    const updateAccountMutation = useUpdateAccount();

    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [locked, setLocked] = useState(false);
    const [bot, setBot] = useState(false);
    const [discoverable, setDiscoverable] = useState(true);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [headerFile, setHeaderFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [headerPreview, setHeaderPreview] = useState<string | null>(null);
    const [cropperType, setCropperType] = useState<'avatar' | 'header' | null>(null);
    const { cropperImage, openCropper, closeCropper, handleCropComplete } = useCropper();

    // Profile metadata fields (up to 4)
    const [fields, setFields] = useState<Array<{ name: string; value: string; verified_at: string | null }>>([
        { name: '', value: '', verified_at: null },
        { name: '', value: '', verified_at: null },
        { name: '', value: '', verified_at: null },
        { name: '', value: '', verified_at: null },
    ]);

    // Initialize form with current account data
    useEffect(() => {
        if (currentAccount) {
            setDisplayName(currentAccount.display_name);
            setBio(currentAccount.note.replace(/<[^>]*>/g, '')); // Strip HTML
            setLocked(currentAccount.locked);
            setBot(currentAccount.bot);
            setDiscoverable(currentAccount.discoverable ?? true);

            // Initialize fields from source (plain text) or fields (HTML)
            const sourceFields = currentAccount.source?.fields || currentAccount.fields || [];
            const initialFields: Array<{ name: string; value: string; verified_at: string | null }> = [
                { name: '', value: '', verified_at: null },
                { name: '', value: '', verified_at: null },
                { name: '', value: '', verified_at: null },
                { name: '', value: '', verified_at: null },
            ];
            sourceFields.forEach((field, index) => {
                if (index < 4) {
                    initialFields[index] = {
                        name: field.name || '',
                        // Use source.fields for plain text value, otherwise strip HTML
                        value: currentAccount.source?.fields?.[index]?.value || field.value.replace(/<[^>]*>/g, '') || '',
                        verified_at: currentAccount.fields?.[index]?.verified_at || null,
                    };
                }
            });
            setFields(initialFields);
        }
    }, [currentAccount]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && openCropper(file)) {
            setCropperType('avatar');
        }
        // Reset input to allow selecting the same file again
        e.target.value = '';
    };

    const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && openCropper(file)) {
            setCropperType('header');
        }
        // Reset input to allow selecting the same file again
        e.target.value = '';
    };

    const onCropComplete = (croppedFile: File) => {
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            const previewUrl = reader.result as string;
            if (cropperType === 'avatar') {
                setAvatarFile(croppedFile);
                setAvatarPreview(previewUrl);
            } else {
                setHeaderFile(croppedFile);
                setHeaderPreview(previewUrl);
            }
        };
        reader.readAsDataURL(croppedFile);
        setCropperType(null);
    };

    const onCropCancel = () => {
        closeCropper();
        setCropperType(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const params: Record<string, string | File | boolean | Array<{ name: string; value: string }>> = {};

        if (displayName !== currentAccount?.display_name) {
            params.display_name = displayName;
        }
        if (bio !== currentAccount?.note.replace(/<[^>]*>/g, '')) {
            params.note = bio;
        }
        if (locked !== currentAccount?.locked) {
            params.locked = locked;
        }
        if (bot !== currentAccount?.bot) {
            params.bot = bot;
        }
        if (discoverable !== (currentAccount?.discoverable ?? true)) {
            params.discoverable = discoverable;
        }
        if (avatarFile) {
            params.avatar = avatarFile;
        }
        if (headerFile) {
            params.header = headerFile;
        }

        // Add fields_attributes - filter out empty fields
        const fieldsToSubmit = fields
            .filter(f => f.name.trim() || f.value.trim())
            .map(f => ({ name: f.name, value: f.value }));
        params.fields_attributes = fieldsToSubmit;

        try {
            await updateAccountMutation.mutateAsync(params);
            router.push(`/@${currentAccount?.acct}`);
        } catch (error) {
            console.error('Failed to update account:', error);
        }
    };

    // Note: Auth protection is handled by middleware (proxy.ts)
    // Show loading state until account data is loaded
    if (isLoading || !currentAccount) {
        return <ProfileEditorSkeleton />;
    }

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: 'var(--size-4)' }}>
            {/* Image Cropper Modal */}
            {cropperImage && (
                <ImageCropper
                    image={cropperImage}
                    onCropComplete={(blob) => handleCropComplete(blob, onCropComplete)}
                    onCancel={onCropCancel}
                    aspectRatio={cropperType === 'avatar' ? 1 : 16 / 9}
                />
            )}

            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--size-3)',
                marginBottom: 'var(--size-5)',
            }}>
                <IconButton onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </IconButton>
                <h1 style={{
                    fontSize: 'var(--font-size-4)',
                    fontWeight: 'var(--font-weight-6)',
                    color: 'var(--text-1)',
                }}>
                    Edit Profile
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                <ProfileImageUploader
                    currentAccount={currentAccount}
                    avatarPreview={avatarPreview}
                    headerPreview={headerPreview}
                    onAvatarChange={handleAvatarChange}
                    onHeaderChange={handleHeaderChange}
                    onRemoveHeader={() => {
                        setHeaderFile(null);
                        setHeaderPreview(null);
                    }}
                />

                <ProfileFieldsEditor
                    displayName={displayName}
                    bio={bio}
                    fields={fields}
                    profileUrl={currentAccount.url || ''}
                    onDisplayNameChange={setDisplayName}
                    onBioChange={setBio}
                    onFieldChange={(index, field, value) => {
                        const newFields = [...fields];
                        newFields[index] = { ...newFields[index], [field]: value };
                        setFields(newFields);
                    }}
                />

                <PrivacySettingsForm
                    locked={locked}
                    bot={bot}
                    discoverable={discoverable}
                    onLockedChange={setLocked}
                    onBotChange={setBot}
                    onDiscoverableChange={setDiscoverable}
                />

                {/* Actions */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--size-3)',
                    justifyContent: 'flex-end',
                }}>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        disabled={updateAccountMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={updateAccountMutation.isPending}
                        isLoading={updateAccountMutation.isPending}
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}

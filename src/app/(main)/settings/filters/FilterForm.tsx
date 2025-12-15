'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { IconButton, Button, Card } from '@/components/atoms';
import { useCreateFilter, useUpdateFilter } from '@/api/mutations';
import { toast } from 'sonner';
import type { Filter, FilterContext, FilterAction, FilterKeywordParams } from '@/types/mastodon';
import {
    FiltersContainer,
    FiltersHeader,
    FiltersTitle,
    FormSection,
    FormLabel,
    FormInput,
    FormSelect,
    CheckboxGroup,
    CheckboxLabel,
    RadioGroup,
    RadioLabel,
    RadioContent,
    RadioTitle,
    RadioDescription,
    KeywordsSection,
    KeywordRow,
    KeywordInput,
    WholeWordCheckbox,
    FormButtons,
} from './FilterStyles';

const CONTEXTS: { value: FilterContext; label: string }[] = [
    { value: 'home', label: 'Home and lists' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'public', label: 'Public timelines' },
    { value: 'thread', label: 'Conversations' },
    { value: 'account', label: 'Profiles' },
];

const ACTIONS: { value: FilterAction; label: string; description: string }[] = [
    { value: 'warn', label: 'Warn', description: 'Show a warning that can be clicked through' },
    { value: 'blur', label: 'Blur', description: 'Blur the content but still show it in the timeline' },
    { value: 'hide', label: 'Hide', description: 'Completely hide the content from view' },
];

const EXPIRATION_OPTIONS = [
    { value: '', label: 'Never expires' },
    { value: '1800', label: '30 minutes' },
    { value: '3600', label: '1 hour' },
    { value: '21600', label: '6 hours' },
    { value: '43200', label: '12 hours' },
    { value: '86400', label: '1 day' },
    { value: '604800', label: '1 week' },
];

interface KeywordState {
    id?: string;
    keyword: string;
    whole_word: boolean;
    isNew?: boolean;
}

interface FilterFormProps {
    filter?: Filter;
    isEdit?: boolean;
}

export function FilterForm({ filter, isEdit = false }: FilterFormProps) {
    const router = useRouter();
    const createFilter = useCreateFilter();
    const updateFilter = useUpdateFilter();

    const [title, setTitle] = useState(filter?.title || '');
    const [expiresIn, setExpiresIn] = useState('');
    const [contexts, setContexts] = useState<FilterContext[]>(
        filter?.context || ['home', 'notifications', 'public', 'thread', 'account']
    );
    const [filterAction, setFilterAction] = useState<FilterAction>(filter?.filter_action || 'warn');
    const [keywords, setKeywords] = useState<KeywordState[]>(
        filter?.keywords.map((k) => ({
            id: k.id,
            keyword: k.keyword,
            whole_word: k.whole_word,
        })) || [{ keyword: '', whole_word: true, isNew: true }]
    );

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Track deleted keywords for update
    const [deletedKeywordIds, setDeletedKeywordIds] = useState<string[]>([]);

    const handleContextChange = (context: FilterContext, checked: boolean) => {
        if (checked) {
            setContexts([...contexts, context]);
        } else {
            setContexts(contexts.filter((c) => c !== context));
        }
    };

    const handleAddKeyword = () => {
        setKeywords([...keywords, { keyword: '', whole_word: true, isNew: true }]);
    };

    const handleRemoveKeyword = (index: number) => {
        const keyword = keywords[index];
        if (keyword.id) {
            setDeletedKeywordIds([...deletedKeywordIds, keyword.id]);
        }
        setKeywords(keywords.filter((_, i) => i !== index));
    };

    const handleKeywordChange = (index: number, value: string) => {
        const newKeywords = [...keywords];
        newKeywords[index] = { ...newKeywords[index], keyword: value };
        setKeywords(newKeywords);
    };

    const handleWholeWordChange = (index: number, checked: boolean) => {
        const newKeywords = [...keywords];
        newKeywords[index] = { ...newKeywords[index], whole_word: checked };
        setKeywords(newKeywords);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Please enter a filter title');
            return;
        }

        if (contexts.length === 0) {
            toast.error('Please select at least one context');
            return;
        }

        const validKeywords = keywords.filter((k) => k.keyword.trim());

        setIsSubmitting(true);

        try {
            if (isEdit && filter) {
                // Build keywords_attributes for update
                const keywordsAttributes: FilterKeywordParams[] = [];

                // Add updated/new keywords
                for (const k of validKeywords) {
                    if (k.id) {
                        keywordsAttributes.push({
                            id: k.id,
                            keyword: k.keyword,
                            whole_word: k.whole_word,
                        });
                    } else {
                        keywordsAttributes.push({
                            keyword: k.keyword,
                            whole_word: k.whole_word,
                        });
                    }
                }

                // Mark deleted keywords
                for (const id of deletedKeywordIds) {
                    keywordsAttributes.push({
                        id,
                        keyword: '', // Required field
                        _destroy: true,
                    });
                }

                await updateFilter.mutateAsync({
                    id: filter.id,
                    params: {
                        title,
                        context: contexts,
                        filter_action: filterAction,
                        expires_in: expiresIn ? parseInt(expiresIn, 10) : undefined,
                        keywords_attributes: keywordsAttributes.length > 0 ? keywordsAttributes : undefined,
                    },
                });
                toast.success('Filter updated');
            } else {
                await createFilter.mutateAsync({
                    title,
                    context: contexts,
                    filter_action: filterAction,
                    expires_in: expiresIn ? parseInt(expiresIn, 10) : undefined,
                    keywords_attributes: validKeywords.map((k) => ({
                        keyword: k.keyword,
                        whole_word: k.whole_word,
                    })),
                });
                toast.success('Filter created');
            }
            router.push('/settings/filters');
        } catch {
            toast.error(isEdit ? 'Failed to update filter' : 'Failed to create filter');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FiltersContainer>
            <FiltersHeader>
                <IconButton onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </IconButton>
                <FiltersTitle>{isEdit ? 'Edit filter' : 'New filter'}</FiltersTitle>
            </FiltersHeader>

            <Card padding="medium">
                <form onSubmit={handleSubmit}>
                    <FormSection>
                        <FormLabel htmlFor="title">Title</FormLabel>
                        <FormInput
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                            placeholder="e.g., Spoilers"
                            required
                        />
                    </FormSection>

                    <FormSection>
                        <FormLabel htmlFor="expires">Expiration</FormLabel>
                        <FormSelect
                            id="expires"
                            value={expiresIn}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExpiresIn(e.target.value)}
                        >
                            {EXPIRATION_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </FormSelect>
                    </FormSection>

                    <FormSection>
                        <FormLabel>Filter contexts</FormLabel>
                        <CheckboxGroup>
                            {CONTEXTS.map((ctx) => (
                                <CheckboxLabel key={ctx.value}>
                                    <input
                                        type="checkbox"
                                        checked={contexts.includes(ctx.value)}
                                        onChange={(e) => handleContextChange(ctx.value, e.target.checked)}
                                    />
                                    {ctx.label}
                                </CheckboxLabel>
                            ))}
                        </CheckboxGroup>
                    </FormSection>

                    <FormSection>
                        <FormLabel>Filter action</FormLabel>
                        <RadioGroup>
                            {ACTIONS.map((action) => (
                                <RadioLabel key={action.value}>
                                    <input
                                        type="radio"
                                        name="filter_action"
                                        value={action.value}
                                        checked={filterAction === action.value}
                                        onChange={() => setFilterAction(action.value)}
                                    />
                                    <RadioContent>
                                        <RadioTitle>{action.label}</RadioTitle>
                                        <RadioDescription>{action.description}</RadioDescription>
                                    </RadioContent>
                                </RadioLabel>
                            ))}
                        </RadioGroup>
                    </FormSection>

                    <FormSection>
                        <FormLabel>Keywords</FormLabel>
                        <KeywordsSection>
                            {keywords.map((keyword, index) => (
                                <KeywordRow key={index}>
                                    <KeywordInput
                                        type="text"
                                        value={keyword.keyword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleKeywordChange(index, e.target.value)}
                                        placeholder="Enter keyword or phrase"
                                    />
                                    <WholeWordCheckbox>
                                        <input
                                            type="checkbox"
                                            checked={keyword.whole_word}
                                            onChange={(e) => handleWholeWordChange(index, e.target.checked)}
                                        />
                                        Whole word
                                    </WholeWordCheckbox>
                                    <IconButton
                                        type="button"
                                        onClick={() => handleRemoveKeyword(index)}
                                        disabled={keywords.length === 1}
                                    >
                                        <X size={16} />
                                    </IconButton>
                                </KeywordRow>
                            ))}
                            <Button type="button" variant="secondary" size="small" onClick={handleAddKeyword}>
                                <Plus size={16} />
                                Add keyword
                            </Button>
                        </KeywordsSection>
                    </FormSection>

                    <FormButtons>
                        <Button type="button" variant="secondary" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Create filter'}
                        </Button>
                    </FormButtons>
                </form>
            </Card>
        </FiltersContainer>
    );
}

/**
 * Annual Reports API (Wrapstodon)
 */

import { api } from './base'
import type { AnnualReportStateResponse, AnnualReportResponse } from '../../types/mastodon'

export async function getAnnualReportState(year: number, signal?: AbortSignal): Promise<AnnualReportStateResponse> {
    const { data } = await api.get<AnnualReportStateResponse>(`/api/v1/annual_reports/${year}/state`, { signal })
    return data
}

export async function generateAnnualReport(year: number): Promise<void> {
    await api.post(`/api/v1/annual_reports/${year}/generate`)
}

export async function getAnnualReport(year: number, signal?: AbortSignal): Promise<AnnualReportResponse> {
    const { data } = await api.get<AnnualReportResponse>(`/api/v1/annual_reports/${year}`, { signal })
    return data
}

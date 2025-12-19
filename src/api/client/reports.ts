/**
 * Reports API
 */

import { api } from './base'
import type { Report, CreateReportParams } from '../../types/mastodon'

export async function createReport(params: CreateReportParams): Promise<Report> {
    const { data } = await api.post<Report>('/api/v1/reports', params)
    return data
}

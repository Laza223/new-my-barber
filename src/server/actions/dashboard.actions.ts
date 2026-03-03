/**
 * Dashboard Server Action.
 */
'use server';

import type { ActionResponse } from '@/lib/types/common';
import type { DashboardData } from '@/lib/types/dashboard';
import { AppError } from '@/server/lib/errors';
import { requireSession } from '@/server/lib/get-session';
import { dashboardService } from '@/server/services/dashboard.service';

export async function getDashboardAction(
  shopId: string,
): Promise<ActionResponse<DashboardData>> {
  try {
    const session = await requireSession();
    const data = await dashboardService.getDashboard(shopId, session.user.id);
    return { success: true, data };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[DASHBOARD] error:', error);
    return { success: false, error: 'Error al cargar el dashboard' };
  }
}

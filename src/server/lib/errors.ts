/**
 * Sistema de errores centralizado.
 *
 * Los Server Actions y servicios lanzan estos errores.
 * El error boundary global los captura y muestra mensajes amigables.
 *
 * Convención: NUNCA usar try/catch en los actions.
 * Los errores burbujean al error boundary.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// ── 400 ──

export class BadRequestError extends AppError {
  constructor(message = 'Solicitud inválida') {
    super(message, 'BAD_REQUEST', 400);
  }
}

export class ValidationError extends AppError {
  constructor(
    message = 'Error de validación',
    details?: Record<string, unknown>,
  ) {
    super(message, 'VALIDATION_ERROR', 422, details);
  }
}

// ── 401 ──

export class UnauthorizedError extends AppError {
  constructor(message = 'No autenticado') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Email o contraseña incorrectos', 'INVALID_CREDENTIALS', 401);
  }
}

// ── 403 ──

export class ForbiddenError extends AppError {
  constructor(message = 'Sin permisos') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class PlanRequiredError extends AppError {
  constructor(requiredPlan: string) {
    super(
      `Esta función requiere el plan ${requiredPlan}`,
      'PLAN_REQUIRED',
      403,
      { requiredPlan },
    );
  }
}

export class SubscriptionRequiredError extends AppError {
  constructor() {
    super(
      'Necesitás una suscripción activa para continuar',
      'SUBSCRIPTION_REQUIRED',
      403,
    );
  }
}

export class LimitReachedError extends AppError {
  constructor(resource: string, limit: number) {
    super(
      `Alcanzaste el límite de ${limit} ${resource} en tu plan actual`,
      'LIMIT_REACHED',
      403,
      { resource, limit },
    );
  }
}

// ── 404 ──

export class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(`${resource} no encontrado`, 'NOT_FOUND', 404);
  }
}

// ── 409 ──

export class ConflictError extends AppError {
  constructor(message = 'El recurso ya existe') {
    super(message, 'CONFLICT', 409);
  }
}

// ── 500 ──

export class InternalError extends AppError {
  constructor(message = 'Error interno del servidor') {
    super(message, 'INTERNAL_ERROR', 500);
  }
}

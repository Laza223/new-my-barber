/**
 * Clases de error del proyecto.
 *
 * Todas extienden AppError para manejo uniforme.
 * Los Server Actions las catchean y retornan ActionResponse.
 * NUNCA se tiran directo al cliente.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code: string = 'BAD_REQUEST',
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Recurso') {
    super(`${resource} no encontrado`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'No estás autenticado') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'No tenés permiso para esta acción') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'El recurso ya existe') {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Datos inválidos') {
    super(message, 422, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class PlanLimitError extends AppError {
  constructor(feature: string, planRequired: string) {
    super(
      `Tu plan actual no incluye ${feature}. Actualizá a ${planRequired}.`,
      403,
      'PLAN_LIMIT_EXCEEDED',
    );
    this.name = 'PlanLimitError';
  }
}

class DefaultError extends Error {
  constructor(message, extra) {
    super(message);
    this.extra = extra;
  }
}

class BadRequest extends Error {
  constructor(message, extra) {
    super(message);
    this.extra = extra;
    this.className = 'BadRequest';
  }
}

class NotFound extends Error {
  constructor(message, extra) {
    super(message);
    this.extra = extra;
    this.className = 'NotFound';
  }
}

class ValidationError extends Error {
  constructor(message, extra) {
    super(message);
    this.extra = extra;
    this.className = 'ValidationError';
  }
}

class ForbidenError extends Error {
  constructor(message, extra) {
    super(message);
    this.extra = extra;
    this.className = 'ForbidenError';
  }
}

class LogicError extends Error {
  constructor(message, extra) {
    super(message);
    this.extra = extra;
    this.className = 'LogicError';
  }
}

class ValueError extends Error {
  constructor(message, extra) {
    super(message);
    this.extra = extra;
    this.className = 'ValueError';
  }
}

class StopSequenceNotChange extends Error {
  constructor(message, extra) {
    super(message);
    this.extra = extra;
    this.className = 'StopSequenceNotChange';
  }
}

class Unauthorized extends Error {
  constructor(message, extra) {
    super(message);
    this.extra = extra;
    this.className = 'Unauthorized';
  }
}

export {
  BadRequest,
  NotFound,
  ValidationError,
  ForbidenError,
  LogicError,
  ValueError,
  StopSequenceNotChange,
  Unauthorized
}
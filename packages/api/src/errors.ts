export class ConnectorError extends Error {
  source: string;
  statusCode: number | undefined;
  
  constructor(source: string, statusCode: number | undefined, message: string) {
    super(message);
    this.source = source;
    this.statusCode = statusCode;
    this.name = 'ConnectorError';
    Object.setPrototypeOf(this, ConnectorError.prototype);
  }
}

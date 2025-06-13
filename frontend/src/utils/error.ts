export class FetchError<T = unknown> extends Error {
  private _data: T;

  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public response: Response | null = null,
    public data: T
  ) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.statusText = statusText;
    this.response = response;
    this._data = data;
  }

}

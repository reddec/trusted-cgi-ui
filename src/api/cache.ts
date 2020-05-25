export type Fetcher<T> = () => Promise<T>;

interface resolver<T> {
  ok: (value: T) => any
  reject: (err: Error) => any
}

export class Cache<T> {
  private pending: resolver<T>[] = []
  private data?: T;
  private loading: boolean = false;
  private version: number = 0;

  constructor(private readonly fetcher: Fetcher<T>) {

  }

  get(force: boolean = false): Promise<T> {
    if (!force && this.data) {
      return Promise.resolve(this.data!!);
    }

    if (this.loading) {
      return new Promise<T>((ok, reject) => {
        this.pending.push({ok, reject})
      })
    }
    this.version += 1;
    this.loading = true;
    this.data = undefined;
    return this.fetch();
  }

  private async fetch(): Promise<T> {
    let oldVersion = this.version;
    try {
      let data = await this.fetcher();
      return this.success(data);
    } catch (e) {
      this.failed(e);
      throw e;
    }
  }

  private failed(e: Error) {
    let cp = this.pending;
    this.loading = false;
    this.pending = [];
    cp.forEach((x) => {
      x.reject(e)
    })
  }

  private success(data: T) {
    let cp = this.pending;
    this.loading = false;
    this.pending = [];
    this.data = data;
    cp.forEach((x) => {
      x.ok(data)
    })
    return data;
  }
}

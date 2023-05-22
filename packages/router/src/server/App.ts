import { Context } from './Context';
import { FnQueue, type JobCurrent } from './FnQueue';
import { Result } from './Result';

export class App {
  private readonly queue = new FnQueue();

  use(handle: JobCurrent) {
    this.queue.push(handle);
  }

  async fetch(request: Request, env: Env): Promise<Response> {
    const ctx = new Context(request, env);
    const result = await this.queue.up(ctx);
    if (result instanceof Response) {
      return result;
    }

    return new Result(result).response();
  }
}

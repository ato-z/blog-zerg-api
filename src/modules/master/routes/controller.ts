import { GET, Group } from '@atoz/router';

@Group('/home')
export class Home {
  protected test = 666;

  @GET('/index')
  index() {
    return '/home/index';
  }

  @GET('/hi')
  hi() {
    return 'hi~';
  }
}

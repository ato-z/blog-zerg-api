import sha1 from 'sha1';
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ServiceManagement {
  static encodePassword(name: string, password: string, level: number) {
    return sha1(
      `${name}${password}${level}${password.length}${
        password.length % name.length
      }`,
    );
  }
}

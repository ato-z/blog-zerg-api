export class DtoLogin {
  user!: string;
  password!: string;

  constructor(option: Partial<DtoLogin>) {
    const { user, password } = option;
    Object.assign(this, { user, password });
  }
}

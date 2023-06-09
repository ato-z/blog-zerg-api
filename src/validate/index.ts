import { ExceptionParam } from '@/exception';
import * as methods from './method';

type Methods = typeof methods;
type WithArgument<F> = F extends (value: any, ...args: infer P) => any
  ? P
  : [any];
type RuleMap = {
  [P in keyof Methods]?: [string, ...WithArgument<Methods[P]>];
};
type RuleParam<T> = Array<{
  name: keyof T;
  rule: RuleMap;
}>;

/**
 * 通用的校验器
 */
export class Validate<T extends {}> {
  constructor(protected target: T, protected readonly rule: RuleParam<T>) {}

  check() {
    const { rule, target } = this;
    const keys = Object.keys(target);
    const inRule: Array<[unknown, RuleMap]> = [];
    for (const key of keys) {
      const curRule = rule.find(item => item.name === key);
      if (curRule === undefined) {
        continue;
      }

      const value = Reflect.get(target, key);
      inRule.push([value, curRule.rule]);
    }

    this.checkItems(inRule);
  }

  private checkItems(inRule: Array<[unknown, RuleMap]>) {
    const trigger = () => {
      const cur = inRule.shift();
      if (cur === undefined) {
        return undefined;
      }

      const [value, rule] = cur;

      this.checkItem(value, rule);

      trigger();
    };

    trigger();
  }

  private checkItem(value: unknown, rule: RuleMap) {
    const keys = Object.keys(rule) as Array<keyof Methods>;

    const trigger = () => {
      const key = keys.shift();
      if (key === undefined) {
        return undefined;
      }

      const checkFn = methods[key];
      const [alertMsg, ...checkArgs] = rule[key]!;
      const callArgs = [value].concat(checkArgs);
      const result = Reflect.apply(checkFn, null, callArgs) as string | boolean;

      if (typeof result === 'string') {
        const msg = alertMsg.replace('$msg', result);
        throw new ExceptionParam(msg);
      }

      trigger();
    };

    trigger();
  }
}

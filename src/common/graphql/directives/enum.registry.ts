import { UserRoleEnum } from '../../../user/enums/user.enum';

const enumRegistry: Record<string, Record<string, string>> = {
  UserRoleEnum: UserRoleEnum,
};

export function getEnumTypeByName(name: string) {
  return enumRegistry[name];
}

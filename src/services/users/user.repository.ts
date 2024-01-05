import { User } from './user.entity';

export const UserRepository = (dataSource: any) => {
  return dataSource.getRepository(User).extend({
    findByName(firstName: string, lastName: string) {
      return this.createQueryBuilder('user')
        .where('user.firstName = :firstName', { firstName })
        .andWhere('user.lastName = :lastName', { lastName })
        .getMany();
    },
  });
};

import { PrismaClient } from '@prisma/client';

import { PermissionService } from '../modules/permission/permission.service';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.$connect();
  console.log('Connected to the database.');

  await prisma.$transaction(
    async (tx) => {
      await tx.menu.deleteMany({
        where: {
          key: {
            startsWith: '/tvWall',
          },
        },
      });

      await PermissionService.addMenus(
        [
          {
            index: 3,
            key: '/tvWall',
            type: 'Directory',
            label: 'TV Wall',
            children: [
              {
                index: 1,
                key: '/tvWall/left01',
                type: 'Page',
                label: 'TV Wall - Left 01',
              },

              {
                index: 2,
                key: '/tvWall/left02',
                type: 'Page',
                label: 'TV Wall - Left 02',
              },

              {
                index: 3,
                key: '/tvWall/left03',
                type: 'Page',
                label: 'TV Wall - Left 03',
              },

              {
                index: 4,
                key: '/tvWall/right01',
                type: 'Page',
                label: 'TV Wall - Right 01',
              },

              {
                index: 5,
                key: '/tvWall/right02',
                type: 'Page',
                label: 'TV Wall - Right 02',
              },
            ],
          },
        ],
        tx,
      );

      const [adminRoles, tvWallMenus] = await Promise.all([
        tx.role.findMany({
          where: {
            name: {
              in: ['Admin', 'Root'],
            },
          },
        }),

        tx.menu.findMany({
          where: {
            key: {
              startsWith: '/tvWall',
            },
          },
        }),
      ]);

      await tx.role.create({
        data: {
          name: '電視牆使用者',
          menus: {
            createMany: {
              data: tvWallMenus.map((menu) => ({ menuId: menu.id })),
            },
          },
        },
      });

      await tx.roleMenu.createMany({
        data: adminRoles.flatMap((role) =>
          tvWallMenus.map((menu) => ({
            roleId: role.id,
            menuId: menu.id,
          })),
        ),
      });
    },
    { isolationLevel: 'ReadUncommitted' },
  );
};

main()
  .then(() => {
    console.log('Seed permission completed.');

    prisma.$disconnect();
  })
  .catch((error) => {
    console.error('Error during seed permission:', error);
    prisma.$disconnect();
    process.exit(1);
  });

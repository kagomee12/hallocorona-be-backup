import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CloudinaryService } from '../clodinary/clodinary.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    try {
      const user = await this.prisma.user.create({
        data: { ...createUserDto },
      });
      return {
        status: 'success',
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to create user',
        error: error.message,
      };
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return {
        status: 'success',
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to retrieve users',
        error: error.message,
      };
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        return {
          status: 'error',
          message: `User with ID ${id} not found`,
        };
      }
      return {
        status: 'success',
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to retrieve user with ID ${id}`,
        error: error.message,
      };
    }
  }

  async findOneByUsername(username: string) {
    try {
      const user = await this.prisma.user.findFirst({ where: { username } });
      if (!user) {
        return {
          status: 'error',
          message: `User with username ${username} not found`,
        };
      }
      return {
        status: 'success',
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to retrieve user with username ${username}`,
        error: error.message,
      };
    }
  }

  async update(
    id: number,
    updateUserDto: Prisma.UserUpdateInput,
    file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        const result = await this.cloudinary.uploadImage(file);
        updateUserDto.profilePic = result.url;
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { ...updateUserDto },
      });
      return {
        status: 'success',
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to update user with ID ${id}`,
        error: error.message,
      };
    }
  }

  async remove(id: number) {
    try {
      const result = await this.prisma.user.deleteMany({
        where: { id },
      });
      if (result.count === 0) {
        return {
          status: 'error',
          message: `User with ID ${id} not found or already deleted`,
        };
      }
      return {
        status: 'success',
        message: `User with ID ${id} deleted successfully`,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to delete user with ID ${id}`,
        error: error.message,
      };
    }
  }
}

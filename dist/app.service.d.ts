import { PrismaService } from './prisma/prisma.service';
export declare class AppService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    getHello(): Promise<{
        id: number;
        email: string;
        fullname: string;
        username: string;
        password: string;
        role: import("prisma/generated/client").$Enums.Role;
        gender: import("prisma/generated/client").$Enums.Gender;
        phone: string;
        address: string;
        profilePic: string | null;
    }[]>;
}

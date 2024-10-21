import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
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

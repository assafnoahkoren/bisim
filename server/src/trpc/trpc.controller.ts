import { Controller, All, Req, Res, Next } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as trpcExpress from '@trpc/server/adapters/express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Controller('trpc')
export class TrpcController {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @All('*')
  async handle(@Req() req: any, @Res() res: any, @Next() next: any) {
    const handler = trpcExpress.createExpressMiddleware({
      router: this.trpcService.getRouter(),
      createContext: ({ req, res }) => {
        // Extract JWT token from Authorization header
        let user: { userId: string; email: string; role: string } | undefined;
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          try {
            const decoded = jwt.verify(
              token,
              this.configService.get<string>('JWT_SECRET') || 'default-secret'
            ) as any;
            user = { userId: decoded.sub, email: decoded.email, role: decoded.role };
          } catch (error) {
            // Invalid token, user remains undefined
          }
        }

        return {
          req,
          res,
          authService: this.authService,
          prisma: this.prisma,
          user,
        };
      },
    });

    handler(req, res, next);
  }
}
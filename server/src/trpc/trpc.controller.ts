import { Controller, All, Req, Res, Next } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';

@Controller('trpc')
export class TrpcController {
  constructor(private readonly trpcService: TrpcService) {}

  @All('*')
  async handle(@Req() req: any, @Res() res: any, @Next() next: any) {
    const handler = trpcExpress.createExpressMiddleware({
      router: this.trpcService.getRouter(),
      createContext: ({ req, res }) => ({ req, res }),
    });

    handler(req, res, next);
  }
}
import { Module } from '@nestjs/common';
import { ApiAuthModule } from '../auth/api-auth.module';
import { ApiUserModule } from '../user/api-user.module';
import { SecurityController} from './security.controller';
import { SecurityService } from './security.service';
import { JwtStrategyService } from '../auth/jwt-strategy.service';

@Module({
  controllers: [SecurityController],
  imports: [ApiAuthModule, ApiUserModule],
  providers: [SecurityService, SecurityController, JwtStrategyService],
})
export class ApiSecurityModule {
}

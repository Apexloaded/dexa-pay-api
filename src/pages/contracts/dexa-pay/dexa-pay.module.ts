import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DexaPayService } from './dexa-pay.service';
import contractConfig from 'src/config/contract.config';
import { AuthModule } from 'src/pages/auth/auth.module';
import { PaymentModule } from 'src/pages/payment/payment.module';
import { DexaPayListener } from './dexa-pay.listener';

@Module({
  imports: [
    ConfigModule.forFeature(contractConfig),
    AuthModule,
    forwardRef(() => PaymentModule),
  ],
  providers: [DexaPayService, DexaPayListener],
  exports: [DexaPayService],
})
export class DexaPayModule {}

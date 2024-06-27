import { OnModuleInit, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, Contract, verifyMessage } from 'ethers';
import DexaPayAbi from './abi/dexa-pay.abi';

@Injectable()
export class DexaPayService implements OnModuleInit {
  private contract: ethers.Contract;
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;

  constructor(
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.provider = new ethers.JsonRpcProvider(
      this.configService.get<string>('BASE_TESTNET'),
    );

    this.signer = new ethers.Wallet(
      this.configService.get<string>('ADMIN_PRIVATE'),
      this.provider,
    );

    this.contract = new Contract(
      this.configService.get<string>('DEXA_PAY'),
      DexaPayAbi,
      this.signer,
    );
  }

  async validateSignature(msg: string, signature: `0x${string}`) {
    verifyMessage(msg, signature);
  }

  async signVerifyClaimEmailFunds(
    domain: ethers.TypedDataDomain,
    types: Record<string, ethers.TypedDataField[]>,
    value: Record<string, any>,
  ) {
    const signature = await this.signer.signTypedData(domain, types, value);
    return signature;
  }

  async linkUserEmailBalance(value: {
    email: string;
    user: string;
    paymentCode: string;
  }) {
    const tx = await this.contract.linkUserEmailBalance(
      value.email,
      value.user,
      value.paymentCode,
    );
    await tx.wait(3);
  }
}
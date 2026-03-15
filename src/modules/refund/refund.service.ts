import { IAuditLogger } from "../audit-log";
import { IRefund, IRefundQuery } from "./refund.interface";
import { RefundRepository } from "./refund.repository";

export class RefundService implements IRefundQuery {
  private readonly refundRepository: RefundRepository;

  constructor(
    repo: RefundRepository,
    private readonly auditLogger: IAuditLogger,
  ) {
    this.refundRepository = repo;
  }

  public async getById(id: string): Promise<IRefund | null> {
    return this.refundRepository.findById(id);
  }
}

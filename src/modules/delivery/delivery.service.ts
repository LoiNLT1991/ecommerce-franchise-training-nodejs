import { IAuditLogger } from "../audit-log";
import { IDelivery, IDeliveryQuery } from "./delivery.interface";
import { DeliveryRepository } from "./delivery.repository";

export class DeliveryService implements IDeliveryQuery {
  private readonly deliveryRepository: DeliveryRepository;

  constructor(
    repo: DeliveryRepository,
    private readonly auditLogger: IAuditLogger,
  ) {
    this.deliveryRepository = repo;
  }

  public async getById(id: string): Promise<IDelivery | null> {
    return this.deliveryRepository.findById(id);
  }
}

import { BaseModule } from "../../core";
import { AuditLogModule } from "../audit-log";
import { DeliveryController } from "./delivery.controller";
import { IDeliveryQuery } from "./delivery.interface";
import { DeliveryRepository } from "./delivery.repository";
import DeliveryRoute from "./delivery.route";
import { DeliveryService } from "./delivery.service";

export class DeliveryModule extends BaseModule<DeliveryRoute> {
  private readonly deliveryQuery: IDeliveryQuery;

  constructor() {
    super();

    // ===== External dependencies =====

    // ===== Internal dependencies =====
    const auditLogModule = new AuditLogModule();
    const auditLogger = auditLogModule.getAuditLogger();
    const repo = new DeliveryRepository();

    // Core service and Http layer
    const service = new DeliveryService(repo, auditLogger);
    const controller = new DeliveryController();
    this.route = new DeliveryRoute(controller);

    this.deliveryQuery = service;
  }

  public getDeliveryQuery(): IDeliveryQuery {
    return this.deliveryQuery;
  }
}
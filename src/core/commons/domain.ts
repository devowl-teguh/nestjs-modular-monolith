export abstract class BaseDomain {
  id: number;
  uuid: string;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;

  getUUID(): string {
    return this.uuid;
  }

  getId(): number {
    return this.id;
  }

  getCreatedBy(): number {
    return this.createdBy;
  }

  getUpdatedBy(): number {
    return this.updatedBy;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}

export interface IBaseDomain {
  id: number;
  uuid: string;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
}

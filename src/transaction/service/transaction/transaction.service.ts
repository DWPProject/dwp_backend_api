import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(private entityManager: EntityManager) {}

  async startTransaction(): Promise<EntityManager> {
    const queryRunner = this.entityManager.queryRunner;
    if (!queryRunner.isTransactionActive) {
      await queryRunner.startTransaction();
    }
    return this.entityManager;
  }

  async commitTransaction(entityManager: EntityManager): Promise<void> {
    const queryRunner = entityManager.queryRunner;
    if (queryRunner.isTransactionActive) {
      await queryRunner.commitTransaction();
    }
  }

  async rollbackTransaction(entityManager: EntityManager): Promise<void> {
    const queryRunner = entityManager.queryRunner;
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }
  }
}

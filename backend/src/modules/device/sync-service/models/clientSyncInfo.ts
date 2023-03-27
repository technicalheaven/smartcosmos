import Sequelize from "sequelize";
import { Table, Model, Column, DataType, HasMany, HasOne } from "sequelize-typescript";

@Table({
  tableName: "clientSyncInfo",
  paranoid: true,
  timestamps: true,
  hooks: {}
})

export class ClientSyncInfo extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue:DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  tenantId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  deviceId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  deviceType!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   entity!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  isExistingDataSynced!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  userSyncedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  tenantSyncedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  siteSyncedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  zoneSyncedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deviceSyncedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  processSyncedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  productSyncedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  tagSyncedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  workflowSyncedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  stateMachineSyncedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  nodeWorkflowSyncedAt!: string;
  
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue:Sequelize.NOW
  })
  queueCreatedAt!: string;
  
  // createdAt, lastUpdatedAt and deletedAt managed by Sequelize
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  })
  createdAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  updatedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  deletedAt!: string | null;
}
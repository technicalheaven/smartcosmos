import Sequelize from "sequelize";
import { Table, Model, Column, DataType, BelongsTo, ForeignKey} from "sequelize-typescript";
import { Tenant } from './tenant';
@Table({
  tableName: "tenantFeatures",
  timestamps: true,
})

export class TenantFeature extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => Tenant)
  @Column({
    type: Sequelize.UUID,
    allowNull: false,
  })
  tenantId!: string;

  @BelongsTo(() => Tenant)
  tenants?: Tenant;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  featureId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  featureName!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue:true,
  })
  isEnabled!: boolean;
  

  // createdAt, updatedAt and deletedAt managed by Sequelize

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  })
  createdAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  })
  updatedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  deletedAt!: string;
}
import Sequelize from "sequelize";
import { Table, Model, Column, DataType, BelongsTo, ForeignKey} from "sequelize-typescript";
import { Tenant } from './tenant';
@Table({
  tableName: "tenantContact",
  timestamps: true,
  paranoid: true,
})

export class TenantContact extends Model {
  @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
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
    allowNull: true,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  middleName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName!: string;


  @Column({
    type: Sequelize.STRING,
    allowNull: false,
  })
  email!: string;
  
  @Column({
    type: Sequelize.STRING,
    allowNull: false,
  })
  phone!: string;


  @Column({
    type: Sequelize.STRING,
    allowNull: false,
  })
  phoneType!: string;


  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['Active', 'Inactive','Deleted'],
    defaultValue: 'Active',
  })
  status!: string;
  
  // createdAt, lastUpdatedAt and deletedAt managed by Sequelize
  
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  createdBy!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  updatedBy!: string;

  
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
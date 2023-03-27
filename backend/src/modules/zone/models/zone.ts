import Sequelize from "sequelize";
import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "zones",
  timestamps: true,
  paranoid: true,
})

export class Zone extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  siteId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  siteName!: string;

  @Column({
    type:DataType.UUID,
    allowNull:false,
  })
  tenantId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  zoneType!: string;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['Active', 'Inactive'],
    defaultValue: 'Active',
  })
  status!: string;
  

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: '0',
  })
  numberOfDevice!: string;

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
  
  // createdAt, lastUpdatedAt and deletedAt managed by Sequelize
  @Column({
    type: DataType.DATE,
    allowNull: true,
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
  deletedAt!: string;
}
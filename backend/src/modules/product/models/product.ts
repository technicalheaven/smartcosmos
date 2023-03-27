import Sequelize from "sequelize";
import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "products",
  paranoid: true,
  timestamps: true,
})

export class Product extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
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
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageURL!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  upc!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  sku!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  manufacturer!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  type!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  categories!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  subCategories!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  price!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  color!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  size!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  images!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  experienceId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  experienceTenantId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  experienceStudioId!: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: null,
  })
  otherAttributes!: string;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['active', 'inactive'],
    defaultValue: 'active',
  })
  status!: string;

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
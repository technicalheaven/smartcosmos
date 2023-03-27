import Sequelize from "sequelize";
import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "enablementByProducts",
  paranoid: true,
  timestamps: true,
})

export class EnablementByProduct extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  tenantId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  siteId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  upc!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  productName!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  count!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  date!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  month!: string;
  
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
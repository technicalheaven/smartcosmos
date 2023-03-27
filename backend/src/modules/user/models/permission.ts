import Sequelize from "sequelize";
import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "permissions",
  timestamps: true,
})

export class Permission extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  id!: string;

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
    allowNull: false,
  })
  route!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  action!: string;


  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  method!: string;


  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  isCustom!: string;


  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  createdBy!: string;


  @Column({
    type: DataType.STRING,
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
    allowNull: false,
    defaultValue: Sequelize.NOW,
  })
  deletedAt!: string;
}

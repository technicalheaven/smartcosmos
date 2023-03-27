import Sequelize from "sequelize";
import { Table, Model, Column, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Role } from "../../../config/db";
import { User } from './user';

@Table({
  tableName: "rolePermissions",
  timestamps: true,
  paranoid: false,
})

export class RolePermission extends Model {
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
  permissionId!: string;




  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  roleId!: string;
  
  @BelongsTo(() => Role)
  roles?: Role;

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
  action!: string;

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
  deletedAt!: string;


}
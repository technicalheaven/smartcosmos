import Sequelize from "sequelize";
import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import { RolePermission } from "../../../config/db";

@Table({
  tableName: "roles",
  timestamps: true,
  paranoid: true,
})

export class Role extends Model {
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
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isPlatformRole!: boolean;
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isCustom!: boolean;
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isActive!: boolean;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  tenantId!: string;
  
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


  @HasMany(() => RolePermission, {
    onDelete: 'CASCADE',
    hooks: true
})
  rolePermission?: RolePermission[];
}
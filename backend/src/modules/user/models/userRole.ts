import Sequelize from "sequelize";
import { Table, Model, Column, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import { User } from './user';

@Table({
  tableName: "userRoles",
  timestamps: true,
  paranoid: true,
})

export class UserRole extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id!: string;
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId!: string;

  @BelongsTo(() => User)
  users?: User;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  tenantId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  roleId!: string;


  @Column({
    type: DataType.STRING,
    allowNull: true,
    get() {
      return this.getDataValue('siteId').split(',')
    },
    set(val:any) {
      this.setDataValue('siteId', val.join(','));
    },
  })
  siteId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    get() {
      return this.getDataValue('deletedSite').split(',')
    },
    set(val:any) {
      this.setDataValue('deletedSite', val.join(','));
    },
  })
  deletedSite!: string;


  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  zoneId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  roleName!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isPlatformRole!: boolean;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  homeSite!: string;

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
import Sequelize from "sequelize";
import { Table, Model, Column, DataType,  BelongsTo, ForeignKey } from "sequelize-typescript";
import { Site } from './site';
@Table({
  tableName: "siteTenant",
  timestamps: true,
  paranoid: true,
})

export class SiteTenant extends Model {
  @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,

  })
  id!: string;
  
  @ForeignKey(() => Site)
  @Column({
    type: Sequelize.UUID,
    allowNull: false,
  })
  siteId!: string;
  
  @BelongsTo(() => Site)
  sites?: Site;


  @Column({
    type: Sequelize.UUID,
    allowNull: false,
  })
  tenantId!: string;

  @Column({
    type: Sequelize.STRING,
    allowNull: false,
  })
  numberOfDevice!: string;
  
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
    defaultValue:null,
  })
  deletedAt!: string;
}
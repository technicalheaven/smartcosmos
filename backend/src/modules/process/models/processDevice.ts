// require('pg').defaults.parseInt8 = true
import Sequelize from "sequelize";
import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import {Process} from './process';


@Table({
  tableName: "processDevices",
  timestamps: true,
})

export class ProcessDevice extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id!: string;
 
  @Column({
    type: DataType.STRING,
    allowNull: false,
    get() {
      return this.getDataValue('deviceId').split(',')
    },
    set(val:any) {
      this.setDataValue('deviceId', val.join(','));
    },
  })
  deviceId!: string;

  @ForeignKey(() => Process)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  processId!: string;


  @BelongsTo(() => Process)
  process?: Process;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    get() {
      return this.getDataValue('roleId').split(',')
    },
    set(val:any) {
      this.setDataValue('roleId', val.join(','));
    },
  })
  roleId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    get() {
      return this.getDataValue('zoneId').split(',')
    },
    set(val:any) {
      this.setDataValue('zoneId', val.join(','));
    },
  })
  zoneId!: string;

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
  
  }


  
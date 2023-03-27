import Sequelize from "sequelize";
import { Table, Model, Column, DataType, HasMany, BelongsTo,ForeignKey} from "sequelize-typescript";
import {DeviceSiteZoneProcess} from './deviceSiteZoneProcess';
import { DeviceTypeModel } from "./deviceTypeModel";


@Table({
  tableName: "deviceConfig",
  paranoid: true,
  timestamps: true,
  hooks: {
    // afterDestroy: (instance, options) => {
    //   instance.getUserRoles().then((userRoles) => {
    //     userRoles.forEach(userRole => {
    //       userRole.destroy(options);
    //     });
    //   }

    //   ); // Softdelete on userrole table
    // }
  }
})
export class DeviceConfig extends Model {
  @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,

  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: Sequelize.STRING,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: Sequelize.STRING,
    allowNull: false,
  })
  type!: string;


  @Column({
    type: Sequelize.STRING,
    allowNull: false,
  })
  mac!: string;

  @ForeignKey(() => DeviceTypeModel)
  @Column({
    type: Sequelize.STRING,
    allowNull: false,
  })
  model!: string;
  @BelongsTo(() => DeviceTypeModel)
  deviceTypeModel?: DeviceTypeModel;

  @Column({
    type: Sequelize.STRING,
    allowNull: true,
  })
  ip!: string;
  
  @Column({
    type: Sequelize.STRING,
    allowNull: true,
  })
  ipType!: string;

  @Column({
    type: Sequelize.STRING,
    allowNull: true,
  })
  url!: string;

  @Column({
    type: Sequelize.STRING,
    allowNull: true,
  })
  deviceManagerUrl!: string;


  @Column({
    type: Sequelize.STRING,
    allowNull: true,
  })
  isUHFSledIncluded!: string;


  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['Active-Running', 'Active-Idle','Inactive','Deleted'],
    defaultValue: 'Active-Idle',
  })
  status!: string;
  
  // createdAt, lastUpdatedAt and deletedAt managed by Sequelize
  
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  lastSyncAt!: string;
  
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




@HasMany(() => DeviceSiteZoneProcess, {
    onDelete: 'CASCADE',
    hooks: true
})
deviceSiteZoneProcess?: DeviceSiteZoneProcess[];



}
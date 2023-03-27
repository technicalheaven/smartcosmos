import Sequelize from "sequelize";
import { Table, Model, Column, DataType, BelongsTo, ForeignKey} from "sequelize-typescript";
import { DeviceConfig } from './deviceConfig';
@Table({
  tableName: "deviceSiteZoneProcess",
  timestamps: true,
  paranoid: true,
})

export class DeviceSiteZoneProcess extends Model {
  @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,

  })
  id!: string;

  @ForeignKey(() => DeviceConfig)
  @Column({
    type: Sequelize.UUID,
    allowNull: false,
  })
  deviceId!: string;

  @BelongsTo(() => DeviceConfig)
  deviceConfig?: DeviceConfig;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  tenantId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  siteId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  siteName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  zoneId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  zoneName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  processId!: string;


  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['Active', 'Inactive','Deleted'],
    defaultValue: 'Active',
  })
  status!: string;
  
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
    defaultValue: null,
  })
  deletedAt!: string;
}